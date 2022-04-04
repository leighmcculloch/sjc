const { stdout, stderr, readTextFile, writeFile, writeTextFile, readDir } =
  Deno;
import * as path from "std/path";
import * as asc from "assemblyscript/asc";

export async function build(
  file: string,
  outFile: string,
  _opts: Record<string, unknown> = {},
): Promise<boolean> {
  const stdouterr = new AscTtyWriter();
  const { error } = await asc.main([
    "--runtime=stub",
    "--disable=bulk-memory",
    "-Osize",
    "--converge",
    `--outFile=${outFile}`,
    file,
  ], {
    stdout: stdouterr,
    stderr: stdouterr,
    readFile: ascReadFile,
    writeFile: ascWriteFile,
    listFiles: ascListFiles,
  });
  if (stdouterr.length() > 0) {
    console.error(stdouterr.toString());
  }
  if (error) {
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
}

class AscTtyWriter {
  buf = "";
  isTTY() {
    return true;
  }
  write(chunk: string) {
    this.buf = this.buf + chunk;
  }
  length() {
    return this.buf.length;
  }
  toString() {
    return this.buf;
  }
}

async function ascReadFile(filename: string, baseDir: string) {
  try {
    const filePath = path.join(baseDir, filename);
    return await readTextFile(filePath);
  } catch {
    return null;
  }
}

async function ascWriteFile(
  filename: string,
  contents: string | Uint8Array,
  baseDir: string,
): Promise<boolean> {
  let filePath = filename;
  if (!path.isAbsolute(filename)) {
    filePath = path.join(baseDir, filename);
  }
  try {
    if (contents instanceof String) {
      await writeTextFile(filePath, contents as string);
      return Promise.resolve(true);
    }
    if (contents instanceof Uint8Array) {
      await writeFile(filePath, contents as Uint8Array);
      return Promise.resolve(true);
    }
  } catch {
    // Do nothing on errors as asc's interface accepts only a false value as a
    // way to indicate an error occurred.
  }
  return Promise.resolve(false);
}

async function ascListFiles(filename: string, baseDir: string) {
  const filePath = path.join(baseDir, filename);
  try {
    const dirEntries = readDir(filePath);
    const files = Array<string>();
    for await (const dirEntry of dirEntries) {
      if (dirEntry.isFile) {
        files.push(dirEntry.name);
      }
    }
    return files;
  } catch {
    return null;
  }
}
