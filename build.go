package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/spf13/cobra"
)

type buildCmd struct {
	ASCPath string
}

func (c *buildCmd) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:                   "build <entry-file>",
		Short:                 "Build an AssemblyScript contract (requires asc to be installed)",
		RunE:                  c.Run,
		Args:                  cobra.ExactArgs(1),
		DisableFlagsInUseLine: true,
	}
	cmd.Flags().StringVar(&c.ASCPath, "asc", "asc", "Path to 'asc' AssemblyScript compiler (install with 'npm install -g assemblyscript'")
	return cmd
}

func (c *buildCmd) Run(cmd *cobra.Command, args []string) error {
	if filepath.Base(c.ASCPath) == c.ASCPath {
		_, err := exec.LookPath(c.ASCPath)
		if err != nil {
			return fmt.Errorf("cannot find 'asc', install asc with 'npm install -g assemblyscript'")
		}
	}
	entryFile := args[0]
	entryFileExt := filepath.Ext(entryFile)
	entryFileName := entryFile[:len(entryFile)-len(entryFileExt)]
	outFile := entryFileName + ".wasm"
	exec := exec.Command(
		c.ASCPath,               // Assume asc is installed and findable in the PATH.
		"--runtime=stub",        // Keeps file size smaller, and we do not need full runtime.
		"--disable=bulk-memory", // Unsupported in fizzy and many wasm runtimes, and is only an optimization.
		"--disable=nontrapping-f2i", // Not yet supported in wazero.
		"-Osize",                // Optimize for file size.
		"-o="+outFile,           // Output file.
		entryFile,
	)
	exec.Stderr = os.Stderr
	exec.Stdin = os.Stdin
	exec.Stdout = os.Stdout
	err := exec.Run()
	return err
}
