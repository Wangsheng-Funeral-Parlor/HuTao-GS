import GlobalState from '@/globalState'
import { getJson, setJson } from '@/utils/json'
import LanguageData, { DEFAULT_LANG } from './data'

const lcachePath = 'data/lcache.json'
const lcache = getJson(lcachePath, {})
let lcacheModified = false

function getNestedValue(key: string, obj: object): string | null {
  const keySegments = key.split('.')
  let value: string | object | null = obj

  while (keySegments.length > 0) {
    const segment = keySegments.shift()
    value = value?.[segment]
  }

  if (typeof value !== 'string') return null
  return value
}

function applyParams(str: string, params: (string | number)[]): string {
  return str.replace(/%\d+/g, id => params[parseInt(id.slice(1))]?.toString())
}

export default function translate(key: string, ...params: (string | number)[]): string {
  const curLang = GlobalState.get('Language')?.toString()
  const cache = lcache[curLang] = lcache[curLang] || {}

  if (cache[key] != null) return applyParams(cache[key], params)

  let str = getNestedValue(key, LanguageData[curLang])
  if (str == null) str = getNestedValue(key, LanguageData[DEFAULT_LANG])
  if (str == null) str = 'E_NO_TRANSLATION'

  cache[key] = str
  lcacheModified = true

  return applyParams(str, params)
}

setInterval(() => {
  if (!lcacheModified) return
  setJson(lcachePath, lcache)
  lcacheModified = false
}, 15e3)