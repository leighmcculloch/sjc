.PHONY: clean build run-example-as run-example-rs

run-example-as: build
	cd examples/basic-as \
		&& ../../build/sjc run contract.ts init \
		&& ../../build/sjc run contract.ts fund acc:G1 \
		&& ../../build/sjc run contract.ts fund acc:G2 \
		&& ../../build/sjc run contract.ts was_created_by_fund acc:G1 \
		&& ../../build/sjc run contract.ts was_created_by_fund acc:G2 \
		&& ../../build/sjc run contract.ts was_created_by_fund acc:G3 \
		&& ../../build/sjc run contract.ts trust_asset acc:G1 asset:USD:G2 \
		&& ../../build/sjc run contract.ts payment acc:G2 acc:G1 asset:USD:G2 u63:100 \
		&& ../../build/sjc run contract.ts balance acc:G1 native \
		&& ../../build/sjc run contract.ts balance acc:G1 asset:USD:G2 \
		&& ../../build/sjc run contract.ts balance acc:G2 native \
		&& ../../build/sjc run contract.ts balance acc:G2 asset:USD:G2 \
		&& true

run-example-rs: build
	cd examples/basic-rs && \
		cargo build --target wasm32-unknown-unknown --release
	cd examples/basic-rs \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm init \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm fund acc:G1 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm fund acc:G2 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G1 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G2 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm was_created_by_fund acc:G3 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm trust_asset acc:G1 asset:USD:G2 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm payment acc:G2 acc:G1 asset:USD:G2 u63:100 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G1 native \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G1 asset:USD:G2 \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G2 native \
		&& ../../build/sjc run target/wasm32-unknown-unknown/release/basic_rs.wasm balance acc:G2 asset:USD:G2 \
		&& true

clean:
	rm -fr build
	rm -fr src/embed.json

build: build/sjc

build/sjc: src/*.json src/*.ts src/embed.json
	cd src && deno compile --allow-read --allow-write --import-map=imports.json -o ../build/sjc sjc.ts
build/sjc-linux-amd64: src/*.json src/*.ts src/embed.json
	cd src && deno compile --allow-read --allow-write --import-map=imports.json -o ../build/sjc-linux-amd64 --target=x86_64-unknown-linux-gnu sjc.ts
build/sjc-macos-amd64: src/*.json src/*.ts src/embed.json
	cd src && deno compile --allow-read --allow-write --import-map=imports.json -o ../build/sjc-macos-amd64 --target=x86_64-apple-darwin sjc.ts
build/sjc-macos-arm64: src/*.json src/*.ts src/embed.json
	cd src && deno compile --allow-read --allow-write --import-map=imports.json -o ../build/sjc-macos-arm64 --target=aarch64-apple-darwin sjc.ts
build/sjc-win.exe: src/*.json src/*.ts src/embed.json
	cd src && deno compile --allow-read --allow-write --import-map=imports.json -o ../build/sjc-win.exe --target=x86_64-pc-windows-msvc sjc.ts

src/embed.json: examples/**/*
	rm -f examples/**/storage.json
	rm -fr examples/basic-rs/target
	rm -fr examples/basic-rs/sdk/target
	deno run \
		--allow-read=examples \
		--allow-write=src/embed.json \
		https://deno.land/x/embed@0.2.5/cli.ts \
		-i examples \
		-o src/embed.json
