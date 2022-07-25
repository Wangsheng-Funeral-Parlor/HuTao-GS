import EventEmitter from 'events'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'
import Logger from './logger'
import { cRGB } from './tty'

const stateFilePath = join(cwd(), 'data/state.json')

const logger = new Logger('GSTATE', 0x5794ff)

export interface GlobalStateData {
  SaveLog: boolean
  SaveRecorder: boolean
  SaveReport: boolean
  PacketDump: boolean
  ShowPacketId: boolean
  UseProtoMatch: boolean
}

export default class GlobalState extends EventEmitter {
  state: GlobalStateData
  modified: boolean

  constructor() {
    super()

    this.state = {
      SaveLog: false,
      SaveRecorder: false,
      SaveReport: false,
      PacketDump: false,
      ShowPacketId: false,
      UseProtoMatch: false
    }
    this.modified = false
  }

  toggle(key: string) {
    const { state } = this
    if (state[key] == null) return

    this.set(key, !state[key])
  }

  set(key: string, val: any) {
    const { state } = this
    if (state[key] == null) return

    if (state[key] !== val) {
      state[key] = val
      this.modified = true
    }

    let msg = `Set: ${cRGB(0xffffff, key)}${cRGB(0x57ff65, ' -> ')}`

    if (typeof val === 'boolean') msg += cRGB(0xffffff, val ? 'Yes' : 'No')
    else msg += cRGB(0xffffff, val)

    logger.info(msg)
  }

  get(key: string) {
    return this.state[key]
  }

  load() {
    const { state } = this

    try {
      if (!existsSync(stateFilePath)) {
        logger.info('No saved state, using default.')
        return
      }

      logger.info('Loading...')

      const saved = JSON.parse(readFileSync(stateFilePath, 'utf8'))

      for (let key in state) {
        if (saved[key] != null) this.set(key, saved[key])
      }
      this.modified = false

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