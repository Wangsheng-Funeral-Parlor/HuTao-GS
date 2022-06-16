import * as fs from 'fs'
const { stat, readFile: read, writeFile: write } = fs.promises

export async function dirExists(path: string): Promise<boolean> {
  try { return (await stat(path)).isDirectory() } catch (err) { return false }
}

export async function fileExists(path: string): Promise<boolean> {
  try { return (await stat(path)).isFile() } catch (err) { return false }
}

export async function readFile(path: string): Promise<Buffer> {
  return read(path)
}

export async function writeFile(path: string, data: string | Buffer): Promise<void> {
  return write(path, data)
}