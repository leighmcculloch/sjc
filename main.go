package main

import (
	"os"

	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{
		Use:   "sjc [command]",
		Short: "Stellar Jump Cannon tool",
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
		Example: "sjc run contract.wasm payment accid(GAN...) accid(GB2...) u63(1000)",
		CompletionOptions: cobra.CompletionOptions{
			DisableDefaultCmd: true,
		},
		SilenceUsage: true,
		DisableFlagsInUseLine: true,
	}
	rootCmd.AddCommand((&initCmd{}).Command())
	rootCmd.AddCommand((&buildCmd{}).Command())
	rootCmd.AddCommand((&runCmd{}).Command())
	rootCmd.SetArgs(os.Args[1:])
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
