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
  CheckHostHeader: boolean
  PacketDump: boolean
  ShowPacketId: boolean
  UseProtoMatch: boolean
  WorldSpawn: boolean
  GenerateSeed: boolean
  ByteCheckMode: number
}

export const DEFAULT_GSTATE: GlobalStateData = {
  Language: DEFAULT_LANG,
  SaveLog: false,
  SaveRecorder: false,
  SaveReport: false,
  CheckHostHeader: false,
  PacketDump: false,
  ShowPacketId: false,
  UseProtoMatch: false,
  WorldSpawn: true,
  GenerateSeed: true,
  ByteCheckMode: -1
}

export default class GlobalState {
  private static instance: GlobalState

  private state: GlobalStateData
  private modified: boolean

  public constructor() {
    this.state = { ...DEFAULT_GSTATE }
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

  public static toggle(key: keyof GlobalStateData) {
    GlobalState.getInstance().toggle(key)
  }

  public toggle(key: keyof GlobalStateData) {
    const { state } = this

    this.set(key, !state[key])
  }

  public static set(key: keyof GlobalStateData, val: GStateValue) {
    GlobalState.getInstance().set(key, val)
  }

  public set<K extends keyof GlobalStateData>(key: K, val: GStateValue) {
    const { state } = this

    if (state[key] == null) return logger.warn('Unknown global state:', key)

    val = this.castValue(key, val)
    if (val == null) return logger.warn('Invalid type, value must be a ', typeof state[key])

    if (state[key] !== val) {
      state[key] = <GlobalStateData[K]>val
      this.modified = true
    }

    this.print(key)
  }

  public static get<K extends keyof GlobalStateData>(key: K): GlobalStateData[K] {
    return GlobalState.getInstance().get(key)
  }

  public get<K extends keyof GlobalStateData>(key: K): GlobalStateData[K] {
    return this.state[key]
  }

  public static print(key: keyof GlobalStateData) {
    GlobalState.getInstance().print(key)
  }

  public print(key: keyof GlobalStateData) {
    const val = this.get(key)
    if (val == null) return

    let msg = `${cRGB(0xffffff, key)}${cRGB(0x57ff65, ' -> ')}`

    if (typeof val === 'boolean') msg += cRGB(0xffffff, val ? 'Yes' : 'No')
    else msg += cRGB(0xffffff, val?.toString())

    logger.info(msg)
  }

  public static printAll() {
    GlobalState.getInstance().printAll()
  }

  public printAll() {
    const { state } = this

    for (const key in state) this.print(<keyof GlobalStateData>key)
  }

  public static load() {
    GlobalState.getInstance().load()
  }

  public load() {
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

  public static save() {
    GlobalState.getInstance().save()
  }

  public save() {
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