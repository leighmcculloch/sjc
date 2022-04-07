const { stat, readFile } = Deno;

export async function inspect(wasmFile: string) {
  const fileStat = await stat(wasmFile);
  console.error("Wasm File:", wasmFile, `(${fileStat.size}B)`);
  const file = await readFile(wasmFile);

  const wasmModule = new WebAssembly.Module(file);
  const imports = WebAssembly.Module.imports(wasmModule);
  console.error(
    "Dependencies:",
    imports.sort((a, b) => a.name > b.name ? 1 : -1),
  );
  const exports = WebAssembly.Module.exports(wasmModule);
  console.error(
    "Functions:",
    exports.filter((e) => e.kind == "function").map((e) => e.name),
  );
}
