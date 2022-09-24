import EventEmitter from 'events'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'
import Logger from './logger'
import { cRGB } from './tty/utils'

const stateFilePath = join(cwd(), 'data/state.json')

const logger = new Logger('GSTATE', 0x5794ff)

export interface GlobalStateData {
  SaveLog: boolean
  SaveRecorder: boolean
  SaveReport: boolean
  PacketDump: boolean
  ShowPacketId: boolean
  UseProtoMatch: boolean
  WorldSpawn: boolean
}

export const DEFAULT_GSTATE = {
  SaveLog: false,
  SaveRecorder: false,
  SaveReport: false,
  PacketDump: false,
  ShowPacketId: false,
  UseProtoMatch: false,
  WorldSpawn: true
}

export default class GlobalState extends EventEmitter {
  state: GlobalStateData
  modified: boolean

  constructor() {
    super()

    this.state = Object.assign({}, DEFAULT_GSTATE)
    this.modified = false
  }

  toggle(key: string): boolean {
    const { state } = this
    return this.set(key, !state[key])
  }

  set(key: string, val: any): boolean {
    const { state } = this
    if (state[key] == null) return false

    if (state[key] !== val) {
      state[key] = val
      this.modified = true
    }

    this.print(key)
    return true
  }

  get(key: string) {
    return this.state[key]
  }

  print(key: string) {
    const val = this.get(key)
    if (val == null) return

    let msg = `Set: ${cRGB(0xffffff, key)}${cRGB(0x57ff65, ' -> ')}`

    if (typeof val === 'boolean') msg += cRGB(0xffffff, val ? 'Yes' : 'No')
    else msg += cRGB(0xffffff, val)

    logger.info(msg)
  }

  printAll() {
    const { state } = this
    for (const key in state) this.print(key)
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

      this.printAll()
      logger.info('Loaded.')
    } catch (err) {
      logger.error('Failed to load state file:', err)
    }
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