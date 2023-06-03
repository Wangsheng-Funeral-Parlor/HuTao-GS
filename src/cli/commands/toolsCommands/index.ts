import { CommandDefinition } from ".."

import autopatchCommand from "./autopatchCommand"
import ec2bCommand from "./ec2bCommand"
import gpatchCommand from "./gpatchCommand"
import keygenCommand from "./keygenCommand"
import metaCommand from "./metaCommands"
import uaCommand from "./uaCommand"

const toolsCommands: CommandDefinition[] = [
  gpatchCommand,
  metaCommand,
  uaCommand,
  autopatchCommand,
  ec2bCommand,
  keygenCommand,
]

export default toolsCommands
