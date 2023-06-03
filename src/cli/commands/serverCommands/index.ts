import { CommandDefinition } from ".."

import disconnectCommand from "./disconnectCommand"
import gsCommand from "./gsCommand"
import helpCommand from "./helpCommand"
import listCommand from "./listCommand"
import logLevelCommand from "./logLevelCommand"
import restartCommand from "./restartCommand"
import stopCommand from "./stopCommand"
import updateCommand from "./updateCommand"
const serverCommands: CommandDefinition[] = [
  helpCommand,
  stopCommand,
  restartCommand,
  logLevelCommand,
  gsCommand,
  updateCommand,
  listCommand,
  disconnectCommand,
]

export default serverCommands
