import Logger, { LogLevel } from '@/logger'
import { formatWithOptions } from 'util'
import translate from '.'

export default class TLogger extends Logger {
  constructor(name?: string, color?: number) {
    super(name, color)
  }

  private parseParams(...params: any[]): string[] {
    return params.map(p => formatWithOptions({ colors: true }, p))
  }

  fatal(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.FATAL)) return
    this.log(LogLevel.FATAL, translate(key, ...this.parseParams(...params)))
  }

  error(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.ERROR)) return
    this.log(LogLevel.ERROR, translate(key, ...this.parseParams(...params)))
  }

  warn(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.WARN)) return
    this.log(LogLevel.WARN, translate(key, ...this.parseParams(...params)))
  }

  info(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.INFO)) return
    this.log(LogLevel.INFO, translate(key, ...this.parseParams(...params)))
  }

  debug(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.DEBUG)) return
    this.log(LogLevel.DEBUG, translate(key, ...this.parseParams(...params)))
  }

  verbose(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.VERBL)) return
    this.log(LogLevel.VERBL, translate(key, ...this.parseParams(...params)))
  }

  extremelyVerbose(key: string, ...params: any[]) {
    if (!this.isLogLevelVisible(LogLevel.VERBH)) return
    this.log(LogLevel.VERBH, translate(key, ...this.parseParams(...params)))
  }
}