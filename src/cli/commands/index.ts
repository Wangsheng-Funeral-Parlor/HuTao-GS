import KcpServer from '#/.'
import Player from '$/player'
import Server from '@/server'
import { cRGB } from '@/tty/utils'
import accountCommands from './accountCommands'
import avatarCommands from './avatarCommands'
import configCommands from './configCommands'
import debugCommands from './debugCommands'
import entityCommands from './entityCommands'
import inventoryCommands from './inventoryCommands'
import playerCommands from './playerCommands'
import serverCommands from './serverCommands'
import toolsCommands from './toolsCommands'
import worldCommands from './worldCommands'

export interface ArgumentDefinition {
  name: string
  type?: 'str' | 'flt' | 'int' | 'num' | 'b64' | 'hex'
  optional?: boolean
  dynamic?: boolean
}

export interface CommandDefinition {
  name: string
  desc: string
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
  server?: Server
  kcpServer?: KcpServer
}

export function helpFormatArgument(argument: ArgumentDefinition) {
  const { name, optional, dynamic, type } = argument

  const bracket = optional ? '[]' : '<>'
  const spread = dynamic ? '...' : ''
  const argType = type == null ? '' : `:${type}`

  return `${bracket[0]}${spread}${name}${argType}${bracket[1]}`
}

export function helpFormatCommand(command: CommandDefinition, prefix: string = '') {
  const { name, args, desc } = command
  return `${cRGB(0xffffff, prefix + name)}${cRGB(0xffb71c, (args != null && args.length > 0) ? (' ' + args.map(helpFormatArgument).join(' ')) : '')} - ${desc}`
}

const commands: CommandDefinition[] = [
  ...serverCommands,
  ...debugCommands,
  ...toolsCommands,
  ...configCommands,

  ...accountCommands,
  ...worldCommands,
  ...entityCommands,
  ...avatarCommands,
  ...playerCommands,
  ...inventoryCommands
]

export default commands