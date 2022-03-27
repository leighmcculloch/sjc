.PHONY: clean build run

run: build
	cd build && ./sjc run basic.wasm invoke 'u32(6)'
	cd build && ./sjc run basic.wasm view 'u32(6)'

build: build/sr build/basic.wasm

build/sr: *.mod *.sum *.go **/*.go
	go build -o build/sjc

build/basic.wasm: examples/basic/*.ts
	cd examples/basic && asc --runtime=stub --disable bulk-memory -Osize -o ../../build/basic.wasm contract.ts

clean:
	rm -fr build
