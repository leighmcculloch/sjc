# sjc basic assemblyscript example

The basic assemblyscript example is a contract that comes with several files and
functions.

- `contract.ts`

  Contains the contract itself and the following functions that can be called:

  - `init` – Takes no arguments and sets up the contract on first run.
    ```
    sjc run contract.ts init
    ```

  - `fund <account>` – Funds a new account.
    ```
    sjc run contract.ts fund acc:G1
    sjc run contract.ts fund acc:G2
    sjc run contract.ts fund acc:G3
    ```

  - `was_created_by_fund <account>` – Returns if account was created by fund or not.
    ```
    sjc run contract.ts was_created_by_fund acc:G1
    sjc run contract.ts was_created_by_fund acc:G4
    ```

  - `trust_asset <account> <asset>` – Updates account to trust and be able to hold asset.
    ```
    sjc run contract.ts trust_asset acc:G2 asset:USD:G1
    sjc run contract.ts trust_asset acc:G3 asset:USD:G1
    ```

  - `payment <source> <destination> <asset> <amount>` – Transfers an asset from source to destination.

    Issue new asset from G1 to G2:
    ```
    sjc run contract.ts payment acc:G1 acc:G2 asset:USD:G1 u63:100
    ```

    Transfer amount from G2 to G3:
    ```
    sjc run contract.ts payment acc:G2 acc:G3 asset:USD:G1 u63:7
    ```

- `sdk/`

  Contain utility functions for types and calling into the host system.
