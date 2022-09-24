import { CommandDefinition } from '..'
import artifactCommand from './artifactCommand'
import artSetCommand from './artSetCommand'
import materialCommand from './materialCommand'
import weaponCommand from './weaponCommand'

const inventoryCommands: CommandDefinition[] = [
  materialCommand,
  weaponCommand,
  artifactCommand,
  artSetCommand
]

export default inventoryCommands