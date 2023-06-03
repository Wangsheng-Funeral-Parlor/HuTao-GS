import * as fs from "fs"
const { mkdir: makeDirectory, stat, readFile: read, writeFile: write, unlink } = fs.promises

export async function dirExists(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory()
  } catch (err) {
    return false
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile()
  } catch (err) {
    return false
  }
}

export async function fileSize(path: string): Promise<number> {
  try {
    return (await stat(path)).size
  } catch (err) {
    return -1
  }
}

export async function mkdir(path: string, opts?: fs.MakeDirectoryOptions): Promise<string> {
  return makeDirectory(path, opts)
}

export async function readFile(path: string): Promise<Buffer> {
  return read(path)
}

export async function writeFile(path: string, data: string | Buffer): Promise<void> {
  return write(path, data)
}

export async function deleteFile(path: string): Promise<void> {
  return unlink(path)
}
