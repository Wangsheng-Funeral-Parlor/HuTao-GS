import { CommandDefinition } from ".."

import abilityCommand from "./abilityCommand"
import entityidCommand from "./entityidCommand"
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
  entityidCommand,
]

export default entityCommands
