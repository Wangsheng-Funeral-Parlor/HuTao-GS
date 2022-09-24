import { CommandDefinition } from '..'
import gadgetCommand from './gadgetCommand'
import killallCommand from './killallCommand'
import monsterCommand from './monsterCommand'
import vehicleCommand from './vehicleCommand'

const entityCommands: CommandDefinition[] = [
  monsterCommand,
  gadgetCommand,
  vehicleCommand,
  killallCommand
]

export default entityCommands
