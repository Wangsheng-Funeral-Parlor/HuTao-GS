import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'
import Logger from './logger'
import { DEFAULT_LANG } from './translate/data'
import { cRGB } from './tty/utils'

const stateFilePath = join(cwd(), 'data/state.json')

const logger = new Logger('GSTATE', 0x5794ff)

type GStateValue = string | number | boolean

export interface GlobalStateData {
  Language: string
  SaveLog: boolean
  SaveRecorder: boolean
  SaveReport: boolean
  PacketDump: boolean
  ShowPacketId: boolean
  UseProtoMatch: boolean
  WorldSpawn: boolean
}

export const DEFAULT_GSTATE: GlobalStateData = {
  Language: DEFAULT_LANG,
  SaveLog: false,
  SaveRecorder: false,
  SaveReport: false,
  PacketDump: false,
  ShowPacketId: false,
  UseProtoMatch: false,
  WorldSpawn: true
}

export default class GlobalState {
  static instance: GlobalState

  state: GlobalStateData
  modified: boolean

  constructor() {
    this.state = Object.assign({}, DEFAULT_GSTATE)
    this.modified = false
  }

  private static getInstance(): GlobalState {
    if (!GlobalState.instance) GlobalState.instance = new GlobalState()
    return GlobalState.instance
  }

  private castValue(key: string, val: GStateValue): GStateValue | null {
    const targetType = typeof DEFAULT_GSTATE[key]
    switch (targetType) {
      case 'string': {
        return val?.toString()
      }
      case 'number': {
        const v = Number(val)
        if (isNaN(v)) return null
        return v
      }
      case 'boolean': {
        const v = val?.toString()?.toLowerCase()
        if (['true', 't', 'yes', 'y', '1'].includes(v)) return true
        if (['false', 'f', 'no', 'n', '0'].includes(v)) return false
        return null
      }
      default: {
        return null
      }
    }
  }

  static toggle(key: string) {
    GlobalState.getInstance().toggle(key)
  }

  toggle(key: string) {
    const { state } = this
    this.set(key, !state[key])
  }

  static set(key: string, val: GStateValue) {
    GlobalState.getInstance().set(key, val)
  }

  set(key: string, val: GStateValue) {
    const { state } = this

    if (state[key] == null) return logger.warn('Unknown global state:', key)

    val = this.castValue(key, val)
    if (val == null) return logger.warn('Invalid type, value must be a ', typeof state[key])

    if (state[key] !== val) {
      state[key] = val
      this.modified = true
    }

    this.print(key)
  }

  static get(key: string): GStateValue {
    return GlobalState.getInstance().get(key)
  }

  get(key: string): GStateValue {
    return this.state[key]
  }

  static print(key: string) {
    GlobalState.getInstance().print(key)
  }

  print(key: string) {
    const val = this.get(key)
    if (val == null) return

    let msg = `${cRGB(0xffffff, key)}${cRGB(0x57ff65, ' -> ')}`

    if (typeof val === 'boolean') msg += cRGB(0xffffff, val ? 'Yes' : 'No')
    else msg += cRGB(0xffffff, val?.toString())

    logger.info(msg)
  }

  static printAll() {
    GlobalState.getInstance().printAll()
  }

  printAll() {
    const { state } = this
    for (const key in state) this.print(key)
  }

  static load() {
    GlobalState.getInstance().load()
  }

  load() {
    const { state } = this

    try {
      if (!existsSync(stateFilePath)) return logger.info('No saved state, using default.')

      logger.info('Loading...')

      const saved = JSON.parse(readFileSync(stateFilePath, 'utf8'))
      for (const key in state) {
        if (saved[key] != null) state[key] = saved[key]
      }

      logger.info('Loaded.')
    } catch (err) {
      logger.error('Failed to load state file:', err)
    }
  }

  static save() {
    GlobalState.getInstance().save()
  }

  save() {
    try {
      if (!this.modified) {
        logger.info('No changes detected.')
        return
      }

      logger.info('Saving...')

      writeFileSync(stateFilePath, JSON.stringify(this.state))
      this.modified = false

      logger.info('Saved.')
    } catch (err) {
      logger.error('Failed to save state file:', err)
    }
  }
}