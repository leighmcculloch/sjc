package main

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

type initCmd struct {
	Example string
}

//go:embed examples
var initFS embed.FS

const initFSRoot = "examples"

var initExamples = func() []string {
	dirs, err := initFS.ReadDir(initFSRoot)
	if err != nil {
		panic(err)
	}
	examples := make([]string, len(dirs))
	for i, d := range dirs {
		examples[i] = d.Name()
	}
	return examples
}()

func (c *initCmd) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:                   "init [-x ex] <path>",
		Short:                 "Initialize a path with an example contract",
		RunE:                  c.Run,
		Args:                  cobra.ExactArgs(1),
		DisableFlagsInUseLine: true,
	}
	cmd.Flags().StringVarP(&c.Example, "example", "x", "basic", "Name of example to init (options: "+strings.Join(initExamples, ", ")+")")
	return cmd
}

func (c *initCmd) Run(cmd *cobra.Command, args []string) error {
	initPath := args[0]
	fmt.Fprintln(os.Stderr, "Initializing directory:", initPath)
	err := os.MkdirAll(initPath, 0o755)
	if err != nil {
		return err
	}
	initFSPath := filepath.Join(initFSRoot, c.Example)
	exampleFS, err := fs.Sub(initFS, initFSPath)
	if err != nil {
		return err
	}
	err = fs.WalkDir(exampleFS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path == "." {
			return nil
		}
		localPath := filepath.Join(initPath, path)

		if d.IsDir() {
			err := os.Mkdir(localPath, 0o755)
			if err != nil {
				return err
			}
			return nil
		}

		f, err := fs.ReadFile(exampleFS, path)
		if err != nil {
			return err
		}
		fmt.Fprintln(os.Stderr, "Writing file:", localPath)
		err = os.WriteFile(localPath, f, 0o644)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
