import * as path from "std/path";
import { Embed } from "x/embed";
import { cac } from "cac";
import { run } from "./run.ts";
import { build } from "./build.ts";

import embedImported from "./embed.json" assert { type: "json" };
const embed = Embed.fromImported(embedImported);

const cli = cac("sjc");

cli
  .command("init <path>", "Init a directory with an example")
  .option("-e, --example <name>", "Example to init with", {
    default: "basic-as",
  })
  .example((name) => `${name} init .`)
  .example((name) => `${name} init -e basic-as . # AssemblyScript`)
  .example((name) => `${name} init -e basic-rs . # Rust`)
  .action((initPath, opts) => {
    Deno.mkdirSync(initPath, { recursive: true });
    const root = `examples/${opts.example}/`;
    for (const entry of embed.walk(root)) {
      const newPath = path.join(initPath, entry.path);
      if (entry.isDirectory) {
        Deno.mkdirSync(newPath, { recursive: true });
      }
      if (entry.isFile) {
        console.error(`Writing ${newPath}...`);
        Deno.writeFileSync(
          newPath,
          embed.readFile(path.join(root, entry.path)),
        );
      }
    }
  });

cli
  .command("build <contract.ts>", "Build a .wasm file from a contract")
  .option("-o, --out <path>", "Out file for the .wasm file")
  .example((name) => `${name} build contract.ts`)
  .action(async (file, opts) => {
    const fileExt = path.extname(file);
    const fileName = file.slice(0, file.length - fileExt.length);
    const outFilePath = opts.out || `${fileName}.wasm`;
    await build(file, outFilePath);
  });

cli
  .command(
    "run <contract.ts/wasm> <func> [...args]",
    "Run a func in a wasm file",
  )
  .option("-s, --storage <file>", "Path to storage", {
    default: "storage.json",
  })
  .option("-v, --verbose", "Verbose output")
  .example((name) => `${name} run contract.ts invoke u63:10 u32:20`)
  .example((name) => `${name} run contract.wasm invoke u63:10 u32:20`)
  .action(async (file, func, args, opts) => {
    let wasmFile = file;
    const fileExt = path.extname(file);
    if (fileExt == ".ts") {
      const fullFileName = path.basename(file);
      const fileName = fullFileName.slice(0, fullFileName.length - fileExt.length);
      const outFileName = `${fileName}.wasm`;
      const tempDir = await Deno.makeTempDir();
      wasmFile = path.join(tempDir, outFileName);
      const buildSuccess = await build(file, wasmFile, {
        verbose: opts.verbose,
      });
      if (!buildSuccess) {
        Deno.exit(1);
      }
    }
    run(wasmFile, func, args, opts);
  });

let helpShown = false;
cli.help(() => {
  helpShown = true;
});
cli.version("0.2.2");

try {
  cli.parse();
  if (!cli.matchedCommand && !helpShown) {
    cli.outputHelp();
  }
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
