import { CommandDefinition } from ".."

const updateCommand: CommandDefinition = {
  name: "update",
  exec: async (cmdInfo) => {
    const { server } = cmdInfo

    await server.update.start()
  },
}

export default updateCommand
