import fs from "fs"
import { join } from "path"
import { performance, PerformanceObserverEntryList } from "perf_hooks"
import { cwd } from "process"

import { getTTY, TTY } from "./tty"
import { cRGB, noColor } from "./tty/utils"
import parseArgs from "./utils/parseArgs"
import { getTimestamp } from "./utils/time"
const { appendFile } = fs.promises

export enum LogLevel {
  NONE = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  PERF = 6,
  VERBL = 7,
  VERBH = 8,
}

const args = parseArgs(process.argv)

let logLevel = args.ll
if (typeof logLevel !== "number") logLevel = LogLevel.DEBUG

let logFileName = null
let logHistory: string[] = null
let logger: Logger

const entryMap: { [name: string]: number[] } = {}
const ENTRY_BUF_LEN = 32

export default class Logger {
  tty: TTY

  name: string
  color: number

  constructor(name?: string, color = 0xffffff) {
    this.tty = args.lm == null ? getTTY() : null

    this.name = name
    this.color = color
  }

  setLogLevel(level: number) {
    logLevel = level
  }

  getLogLevel() {
    return logLevel
  }

  isLogLevelVisible(level: LogLevel) {
    return level <= Number(logLevel)
  }

  write(str: string) {
    this.tty?.write(str)
  }

  log(level: LogLevel, ...args: any[]) {
    const { name, color, tty } = this

    if (!this.isLogLevelVisible(level)) return

    let prefix = `[${getTimestamp()}]`

    switch (level) {
      case LogLevel.FATAL:
        prefix += `|${cRGB(0xff0000, "FATAL")}|`
        break
      case LogLevel.ERROR:
        prefix += `|${cRGB(0xff0000, "ERROR")}|`
        break
      case LogLevel.WARN:
        prefix += `|${cRGB(0xf5ff36, "WARN")} |`
        break
      case LogLevel.INFO:
        prefix += `|${cRGB(0x61ff66, "INFO")} |`
        break
      case LogLevel.DEBUG:
        prefix += `|${cRGB(0x8af3ff, "DEBUG")}|`
        break
      case LogLevel.PERF:
        prefix += `|${cRGB(0x8ab9ff, "PERF")} |`
        break
      case LogLevel.VERBL:
        prefix += `|${cRGB(0x17ff7c, "VERBL")}|`
        break
      case LogLevel.VERBH:
        prefix += `|${cRGB(0x17ff36, "VERBH")}|`
        break
    }

    if (name != null) prefix += `[${cRGB(color, name)}]`

    const logStr = tty?.print(prefix, ...args)
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
    for (const perfEntry of list.getEntries()) {
      const { name, duration } = perfEntry
      const entry = entryMap[name] || (entryMap[name] = [1, 0])

      entry[0] = 1

      entry.push(duration)
      if (entry.length > ENTRY_BUF_LEN + 2) entry.splice(2, entry.length - ENTRY_BUF_LEN)
    }

    const now = Date.now()

    for (const name in entryMap) {
      const entry = entryMap[name]

      if (entry[0] === 0 || now - entry[1] < 3e3) continue

      entry[0] = 0
      entry[1] = now

      const slicedEntry = entry.slice(2)
      const avg = Math.floor(slicedEntry.reduce((c, p) => p + c) / slicedEntry.length)

      const min = Math.floor(Math.min(...slicedEntry))
      const max = Math.floor(Math.max(...slicedEntry))

      this.log(LogLevel.PERF, "Avg:", `${avg}ms`, "Min:", `${min}ms`, "Max:", `${max}ms`, "Name:", name)
    }
  }

  verbose(...args: any[]) {
    this.log(LogLevel.VERBL, ...args)
  }

  extremelyVerbose(...args: any[]) {
    this.log(LogLevel.VERBH, ...args)
  }

  static mark(name: string) {
    performance.clearMarks(name)
    performance.mark(name)
  }

  static clearMarks(name: string) {
    performance.clearMarks(name)
  }

  static measure(name: string, markName: string) {
    try {
      ;(<any>performance).clearMeasures(name) // ???
      performance.measure(name, markName)
    } catch (err) {}
  }

  static getLogger(): Logger {
    logger = logger || new Logger("LOGGER")
    return logger
  }

  static startCapture() {
    if (logHistory != null) return

    logFileName = getTimestamp().replace(/:/g, ".")
    logHistory = []

    this.getLogger().info("Log capture started at:", getTimestamp())
  }

  static async stopCapture(save = true): Promise<void> {
    if (logHistory == null) return

    if (save) await Logger.saveCapture()

    logFileName = null
    logHistory = null

    this.getLogger().info("Log capture stopped.")
  }

  static async saveCapture(): Promise<void> {
    if (logFileName == null || logHistory == null) return

    const history = logHistory.slice(0)
    if (history.length === 0) return

    try {
      this.getLogger().info("Saving log capture...")

      await appendFile(join(cwd(), "data/log/server", `${logFileName}.txt`), history.join("\n") + "\n")

      this.getLogger().info("Saved log capture.")
    } catch (err) {
      this.getLogger().error("Error while saving log capture:", err)
    }
  }
}
