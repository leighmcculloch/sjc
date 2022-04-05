# sjc-cli

CLI tool for prototyping contracts in AssemblyScript and Rust for the [experimental WASM design] of [Stellar Jump Cannon].

Note that this tool implements some aspect of the design using shortcuts, and so it may not be identical to the [experimental WASM design]. The CLI is intended for early experimentation.

## Install

```
curl -fsSL https://github.com/leighmcculloch/sjc/raw/main/install.sh | sh
```

or

Download a binary from [Releases].

or

Install from source by first installing [Deno], then:
```
git clone https://github.com/leighmcculloch/sjc
cd sjc
make build
```

## Usage

```
Usage:
  $ sjc <command> [options]

Commands:
  init <path>                              Init a directory with an example
  build <contract.ts>                      Build a .wasm file from a contract
  run <contract.ts/wasm> <func> [...args]  Run a func in a wasm file

For more info, run any command with the `--help` flag:
  $ sjc init --help
  $ sjc build --help
  $ sjc run --help

Options:
  -h, --help     Display this message 
  -v, --version  Display version number 
```

### Setup a new project from an example
```
sjc init mycontract
```

### Run a contract
```
cd mycontract
sjc run contract.ts init
sjc run contract.ts fund acc:G123
...
```

Arguments to functions are in the form `<type>:<value>`, where the following
types are supported:
- `u63`, e.g. `u63:1234` (unsigned 63-bit integer, used for amounts)
- `u32`, e.g. `u32:1234` (unsigned 32-bit integer)
- `i32`, e.g. `i32:1234` (signed 32-bit integer)
- `void`, e.g. `void`
- `bool`, e.g. `bool:true` (boolean)
- `acc`, e.g. `acc:G1234` (account)
- `native`, e.g. `native` (native asset)
- `asset`, e.g. `asset:USD:G1234` (issued asset)

See `storage.json` for stored data.

[experimental WASM design]: https://github.com/stellar/stellar-core/pull/3380
[Stellar Jump Cannon]: https://stellar.org/blog/smart-contracts-on-stellar-why-now
[Deno]: https://deno.land
[Releases]: https://github.com/leighmcculloch/sjc/releases/latest
