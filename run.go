package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/spf13/cobra"
	"github.com/tetratelabs/wazero"

	"github.com/leighmcculloch/sjc/val"
)

type runCmd struct {
	StorageFile string
}

func (c *runCmd) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:                   "run <file> <func> [params]...",
		Short:                 "Run a func in a wasm file",
		RunE:                  c.Run,
		Args:                  cobra.MinimumNArgs(2),
		DisableFlagsInUseLine: true,
	}
	cmd.Flags().StringVarP(&c.StorageFile, "storage", "s", "storage.json", "Persistent storage JSON file")
	return cmd
}

func (c *runCmd) Run(cmd *cobra.Command, args []string) error {
	h := &Host{}

	fmt.Fprintln(os.Stderr, "Storage File:", c.StorageFile)
	sf, err := os.OpenFile(c.StorageFile, os.O_CREATE|os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer sf.Close()
	err = json.NewDecoder(sf).Decode(&h)
	if err != io.EOF && err != nil {
		return fmt.Errorf("reading storage: %w", err)
	}

	file := args[0]
	funcName := args[1]
	funcArgsStrs := args[2:]

	fmt.Fprintln(os.Stderr, "Wasm File:", file)
	source, err := os.ReadFile(file)
	if err != nil {
		return err
	}

	config := wazero.NewRuntimeConfigInterpreter()
	runtime := wazero.NewRuntimeWithConfig(config)
	importObj, err := runtime.NewModuleBuilder("env").ExportFunctions(h.funcs()).Build()
	if err != nil {
		return err
	}
	_, err = runtime.InstantiateModule(importObj)
	if err != nil {
		return err
	}
	mod, err := runtime.InstantiateModuleFromSource(source)
	if err != nil {
		return err
	}
	defer mod.Close()

	fmt.Fprintln(os.Stderr, "Func:", funcName)

	funcArgs := make([]val.Val, len(funcArgsStrs))
	funcArgsUint := make([]uint64, len(funcArgsStrs))
	for i, a := range funcArgsStrs {
		funcArgs[i], err = val.Parse(a)
		if err != nil {
			return err
		}
		funcArgsUint[i] = uint64(funcArgs[i])
	}
	fmt.Fprintln(os.Stderr, "Params:", funcArgs)

	ctx := context.Background()
	result, err := mod.ExportedFunction(funcName).Call(mod.WithContext(ctx), funcArgsUint...)
	if err != nil {
		return err
	}
	if len(result) == 0 {
		fmt.Fprintln(os.Stderr, "Result:", "void")
	} else {
		resultVal := val.Val(result[0])
		fmt.Fprintln(os.Stderr, "Result:", resultVal)
		fmt.Fprintln(os.Stdout, resultVal)
	}

	err = sf.Truncate(0)
	if err != nil {
		return fmt.Errorf("writing storage: %w", err)
	}
	_, err = sf.Seek(0, 0)
	if err != nil {
		return fmt.Errorf("writing storage: %w", err)
	}
	enc := json.NewEncoder(sf)
	enc.SetIndent("", "\t")
	err = enc.Encode(&h)
	if err != nil {
		return fmt.Errorf("writing storage: %w", err)
	}

	return nil
}
