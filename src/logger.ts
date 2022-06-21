import fs from 'fs'
const { appendFile } = fs.promises
import { join } from 'path'
import { cwd } from 'process'
import { PerformanceObserverEntryList } from 'perf_hooks'
import getTTY, { TTY, cRGB, noColor } from './tty'

export enum LogLevel {
  NONE = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  PERF = 6,
  VERBL = 7,
  VERBH = 8
}

let logLevel = parseInt((process.argv.find(arg => arg.indexOf('-ll:') === 0) || `-ll:${LogLevel.INFO}`).split(':')[1])

let logFileName = null
let logHistory: string[] = null
let logger: Logger

const entryMap: { [name: string]: number[] } = {}

function getTimestamp(): string {
  const d = new Date()
  const Y = d.getFullYear().toString()
  const M = (d.getMonth() + 1).toString().padStart(2, '0')
  const D = d.getDate().toString().padStart(2, '0')
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')

  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

export default class Logger {
  tty: TTY

  name: string
  color: number

  constructor(name?: string, color: number = 0xffffff) {
    this.tty = getTTY()

    this.name = name
    this.color = color
  }

  setLogLevel(level: number) {
    logLevel = level
  }

  getLogLevel() {
    return logLevel
  }

  write(str: string) {
    this.tty.write(str)
  }

  log(level: LogLevel, ...args: any[]) {
    const { name, color, tty } = this

    if (level > logLevel) return

    let prefix = `[${getTimestamp()}]`

    switch (level) {
      case LogLevel.FATAL:
        prefix += `|${cRGB(0xff0000, 'FATAL')}|`
        break
      case LogLevel.ERROR:
        prefix += `|${cRGB(0xff0000, 'ERROR')}|`
        break
      case LogLevel.WARN:
        prefix += `|${cRGB(0xf5ff36, 'WARN')} |`
        break
      case LogLevel.INFO:
        prefix += `|${cRGB(0x61ff66, 'INFO')} |`
        break
      case LogLevel.DEBUG:
        prefix += `|${cRGB(0x8af3ff, 'DEBUG')}|`
        break
      case LogLevel.PERF:
        prefix += `|${cRGB(0x8ab9ff, 'PERF')} |`
        break
      case LogLevel.VERBL:
        prefix += `|${cRGB(0x17ff7c, 'VERBL')}|`
        break
      case LogLevel.VERBH:
        prefix += `|${cRGB(0x17ff36, 'VERBH')}|`
        break
    }

    if (name != null) prefix += `[${cRGB(color, name)}]`

    const logStr = tty.print(prefix, ...args)
    if (logHistory == null) return

    logHistory.push(noColor(logStr))
  }

  fatal(...args: any[]) {
    this.log(LogLevel.FATAL, ...args)
  }

  error(...args: any[]) {
    this.log(LogLevel.ERROR, ...args)
  }

  warn(...args: any[]) {
    this.log(LogLevel.WARN, ...args)
  }

  info(...args: any[]) {
    this.log(LogLevel.INFO, ...args)
  }

  debug(...args: any[]) {
    this.log(LogLevel.DEBUG, ...args)
  }

  performance(list: PerformanceObserverEntryList) {
    for (let perfEntry of list.getEntries()) {
      const { name, duration } = perfEntry
      const entry = entryMap[name] || (entryMap[name] = [1, 0])

      entry[0] = 1

      entry.push(duration)
      if (entry.length > 12) entry.splice(2, entry.length - 10)
    }

    const now = Date.now()

    for (let name in entryMap) {
      const entry = entryMap[name]

      if (entry[0] === 0 || now - entry[1] < 3e3) continue

      entry[0] = 0
      entry[1] = now

      const slicedEntry = entry.slice(2)
      const avg = Math.floor(slicedEntry.reduce((c, p) => p + c) / entry.length)

      const min = Math.floor(Math.min(...slicedEntry))
      const max = Math.floor(Math.max(...slicedEntry))

      this.log(LogLevel.PERF, 'Perf:', name, 'Avg:', `${avg}ms`, 'Min:', `${min}ms`, 'Max:', `${max}ms`)
    }
  }

  verbose(...args: any[]) {
    this.log(LogLevel.VERBL, ...args)
  }

  extremelyVerbose(...args: any[]) {
    this.log(LogLevel.VERBH, ...args)
  }

  static getLogger(): Logger {
    logger = logger || new Logger('LOGGER')
    return logger
  }

  static startCapture() {
    if (logHistory != null) return

    logFileName = getTimestamp().replace(/:/g, '.')
    logHistory = []

    this.getLogger().info('Log capture started at:', getTimestamp())
  }

  static async stopCapture(save: boolean = true): Promise<void> {
    if (logHistory == null) return

    if (save) await Logger.saveCapture()

    logFileName = null
    logHistory = null

    this.getLogger().info('Log capture stopped.')
  }

  static async saveCapture(): Promise<void> {
    if (logFileName == null || logHistory == null) return

    const history = logHistory.slice(0)
    if (history.length === 0) return

    try {
      this.getLogger().info('Saving log capture...')

      await appendFile(join(cwd(), 'data/log/server', `${logFileName}.txt`), history.join('\n') + '\n')

      this.getLogger().info('Saved log capture.')
    } catch (err) {
      this.getLogger().error('Error while saving log capture:', err)
    }
  }
}