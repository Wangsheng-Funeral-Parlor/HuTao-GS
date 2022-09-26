import KcpServer from '#/.'
import Player from '$/player'
import Server from '@/server'
import { TTY } from '@/tty'
import CLI from '..'
import accountCommands from './accountCommands'
import avatarCommands from './avatarCommands'
import configCommands from './configCommands'
import entityCommands from './entityCommands'
import inventoryCommands from './inventoryCommands'
import playerCommands from './playerCommands'
import serverCommands from './serverCommands'
import toolsCommands from './toolsCommands'
import worldCommands from './worldCommands'

export interface ArgumentDefinition {
  name: string
  type?: 'str' | 'flt' | 'int' | 'num' | 'b64' | 'hex'
  values?: (string | number)[]
  optional?: boolean
  dynamic?: boolean
}

export interface CommandDefinition {
  name: string
  usage?: number | string[]
  args?: ArgumentDefinition[]
  allowPlayer?: boolean
  onlyAllowPlayer?: boolean
  exec: (cmdInfo: CmdInfo) => Promise<void>
}

export interface CLILike {
  print: (...args: any[]) => void
  printError: (...args: any[]) => void
}

export interface CmdInfo {
  args?: any[]
  sender?: Player
  cli: CLILike
  tty?: TTY
  server?: Server
  kcpServer?: KcpServer
}

export function registerBuiltInCommands() {
  CLI.registerCommands([
    ...serverCommands,
    ...configCommands,
    ...toolsCommands,
    ...accountCommands,
    ...worldCommands,
    ...entityCommands,
    ...avatarCommands,
    ...playerCommands,
    ...inventoryCommands
  ])
}