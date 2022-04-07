const { stat, readFile, readTextFile, writeTextFile } = Deno;
import * as fs from "std/fs";
import { Host } from "./host.ts";
import { Storage } from "./storage.ts";
import * as val from "./val.ts";

interface RunOptions {
  verbose: boolean;
  storage: string;
}

export async function run(
  wasmFile: string,
  funcName: string,
  funcArgs: string[],
  opts: RunOptions,
) {
  await fs.ensureFile(opts.storage);
  const storageText = await readTextFile(opts.storage);
  let storage: Storage;
  if (storageText) {
    try {
      storage = Storage.fromObject(JSON.parse(storageText));
    } catch (error) {
      console.error(`${opts.storage} invalid and resetting: ${error}`);
      storage = new Storage();
    }
  } else {
    storage = new Storage();
  }
  if (opts.verbose) {
    console.error("Storage:", opts.storage);
  }

  const file = await readFile(wasmFile);

  const wasmModule = new WebAssembly.Module(file);
  const h = new Host(storage);
  const importObj = { env: h.funcs() };
  const wasmInstance = new WebAssembly.Instance(wasmModule, importObj);

  if (opts.verbose) {
    console.error("Invoke Func:", funcName);
    if (funcArgs.length > 0) {
      console.error("With Args (strs):", funcArgs);
    }
  }
  const funcArgsVals = funcArgs.map((v) =>
    val.fromString(v as string, storage)
  );
  if (opts.verbose) {
    if (funcArgsVals.length > 0) {
      console.error("With Args (vals):", funcArgsVals);
    }
  }
  const rawFunc = wasmInstance.exports[funcName];
  if (rawFunc == undefined) {
    const funcs = WebAssembly.Module.exports(wasmModule).filter((e) =>
      e.kind == "function"
    ).map((e) => e.name);
    throw new Error(
      `"${funcName}" is not the name of a function, did you mean: ${
        funcs.join(", ")
      }?`,
    );
  }
  const func = rawFunc as CallableFunction;
  const retVal = func(...funcArgsVals);
  if (retVal === undefined) {
    if (opts.verbose) {
      console.error("Return:", []);
    }
  } else {
    if (opts.verbose) {
      console.error("Return:", [val.toString(retVal, storage)]);
    }
    console.log(val.toString(retVal, storage, true));
  }
  await writeTextFile(opts.storage, JSON.stringify(h.storage, null, 2));
}
