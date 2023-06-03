import { CommandDefinition } from ".."

import keyGen from "@/tools/keyGen"

const keygenCommand: CommandDefinition = {
  name: "keygen",
  exec: async () => keyGen(),
}

export default keygenCommand
