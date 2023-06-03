import { CommandDefinition } from ".."

import abilityCommand from "./abilityCommand"
import gadgetCommand from "./gadgetCommand"
import killallCommand from "./killallCommand"
import spawnCommand from "./spawnCommand"
import vehicleCommand from "./vehicleCommand"

const entityCommands: CommandDefinition[] = [
  spawnCommand,
  gadgetCommand,
  vehicleCommand,
  killallCommand,
  abilityCommand,
]

export default entityCommands
