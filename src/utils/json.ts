import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

export const getJson = (path: string, defValue: any = null): any => {
  try {
    const data = JSON.parse(readFileSync(join(cwd(), path), 'utf8'))

    if (Array.isArray(data)) return data
    if (typeof defValue === 'object') return Object.assign({}, defValue, data)

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