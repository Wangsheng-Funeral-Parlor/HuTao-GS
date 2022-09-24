import { CommandDefinition } from '..'
import coopCommand from './coopCommand'
import posCommand from './posCommand'
import sceneCommand from './sceneCommand'
import tpCommand from './tpCommand'

const worldCommands: CommandDefinition[] = [
  posCommand,
  sceneCommand,
  tpCommand,
  coopCommand
]

export default worldCommands