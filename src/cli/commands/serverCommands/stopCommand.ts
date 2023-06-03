import { CommandDefinition } from ".."

import CLI from "@/cli"
import Server from "@/server"

const stopCommand: CommandDefinition = {
  name: "stop",
  exec: async (cmdInfo) => {
    const { cli, server } = <{ cli: CLI; server: Server }>cmdInfo

    cli.stop()
    await server.stop()
  },
}

export default stopCommand
