.PHONY: clean build run run-example-as run-example-rs

run: build
	build/sjc version

run-as: build
	$(MAKE) -C examples/basic-as SJC=$(PWD)/build/sjc

run-rs: build
	$(MAKE) -C examples/basic-rs SJC=$(PWD)/build/sjc

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
