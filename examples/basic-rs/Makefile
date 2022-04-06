CARGO?=cargo
SJC?=sjc

.PHONY: build test

test: build
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm init
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm fund acc:G1
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm fund acc:G2
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G1
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G2
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G3
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm trust_asset acc:G1 asset:USD:G2
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm payment acc:G2 acc:G1 asset:USD:G2 u63:100
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G1 native
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G1 asset:USD:G2
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G2 native
	$(SJC) run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G2 asset:USD:G2

build:
	$(CARGO) build --target wasm32-unknown-unknown --release
