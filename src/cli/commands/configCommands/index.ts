import { CommandDefinition } from ".."

import createConfigCommand from "./createConfigCommand"
import deleteConfigCommand from "./deleteConfigCommand"
import loadConfigCommand from "./loadConfigCommand"

const configCommands: CommandDefinition[] = [createConfigCommand, deleteConfigCommand, loadConfigCommand]

export default configCommands
