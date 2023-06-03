import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { cwd } from "process"

import { parseAsync, stringifyAsync } from "yieldable-json"

import { fileExists, readFile, writeFile } from "./fileSystem"

const cache = new Map()
export const getJson = (path: string, defValue: any = null): any => {
  try {
    const data = JSON.parse(readFileSync(join(cwd(), path), "utf8"))

    if (Array.isArray(data)) return data
    if (typeof defValue === "object") return Object.assign({}, defValue, data)

    return data
  } catch (err) {
    return defValue
  }
}

export const setJson = (path: string, value: any): boolean => {
  try {
    writeFileSync(join(cwd(), path), JSON.stringify(value, null, 2))
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const hasJson = (path: string): boolean => existsSync(join(cwd(), path))

export const getJsonAsync = (path: string, defValue: any = null): Promise<any> => {
  return new Promise(async (resolve) => {
    const jsonPath = join(cwd(), path)
    if (!(await fileExists(jsonPath))) return resolve(defValue)

    if (cache.has(jsonPath) && path.includes("game")) return resolve(cache.get(jsonPath))

    try {
      parseAsync((await readFile(jsonPath)).toString(), async (err, data) => {
        if (err) return resolve(false)

        if (Array.isArray(data)) {
          cache.set(jsonPath, data)
          return resolve(data)
        }
        if (typeof defValue === "object") {
          const mergedData = Object.assign({}, defValue, data)
          cache.set(jsonPath, mergedData)
          return resolve(mergedData)
        }

        cache.set(jsonPath, data)
        resolve(data)
      })
    } catch (err) {
      resolve(defValue)
    }
  })
}

export const setJsonAsync = (path: string, value: any): Promise<boolean> => {
  return new Promise((resolve) => {
    const jsonPath = join(cwd(), path)
    stringifyAsync(value, async (err, str) => {
      if (err) return resolve(false)

      try {
        await writeFile(jsonPath, str)
        resolve(true)
      } catch (e) {
        console.log(e)
        resolve(false)
      }
    })
  })
}

export const hasJsonAsync = async (path: string): Promise<boolean> => fileExists(join(cwd(), path))
