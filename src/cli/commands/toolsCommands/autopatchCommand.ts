import { CommandDefinition } from ".."

import { update } from "@/tools/autoPatch"

const autopatchCommand: CommandDefinition = {
  name: "autopatch",
  exec: async () => update(),
}

export default autopatchCommand
