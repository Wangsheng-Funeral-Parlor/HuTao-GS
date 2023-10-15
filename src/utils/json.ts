import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'
import { parseAsync, stringifyAsync } from 'yieldable-json'
import { fileExists, readFile, writeFile } from './fileSystem'

const cacheMap = new Map()

export const getJson = (path: string, defValue: any = null): any => {
  try {
    const data = JSON.parse(readFileSync(join(cwd(), path), 'utf8'))

    if (Array.isArray(data)) return data
    if (typeof defValue === 'object') return { ...defValue, ...data }

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

export const getJsonAsync = async (path: string, defValue: any = null, useCache = false): Promise<any> => {
  const jsonPath = join(cwd(), path)

  if (useCache && cacheMap.has(jsonPath)) return cacheMap.get(jsonPath)
  if (!await fileExists(jsonPath)) return defValue

  let fileData: string

  try {
    fileData = (await readFile(jsonPath)).toString()
  } catch (err) {
    return defValue
  }

  return new Promise(resolve => {
    parseAsync(fileData, (err, data) => {
      if (err) return resolve(false)

      if (Array.isArray(data)) {
        cacheMap.set(jsonPath, data)
        return resolve(data)
      }
      if (typeof defValue === 'object') {
        const mergedData = { ...defValue, ...data }
        cacheMap.set(jsonPath, mergedData)
        return resolve(mergedData)
      }

      cacheMap.set(jsonPath, data)

      resolve(data)
    })
  })
}

export const setJsonAsync = (path: string, value: any): Promise<boolean> => {
  return new Promise(resolve => {
    const jsonPath = join(cwd(), path)
    stringifyAsync(value, (err, str) => {
      if (err) return resolve(false)

      writeFile(jsonPath, str)
        .then(() => resolve(true))
        .catch(e => {
          console.log(e)
          resolve(false)
        })
    })
  })
}

export const hasJsonAsync = async (path: string): Promise<boolean> => fileExists(join(cwd(), path))