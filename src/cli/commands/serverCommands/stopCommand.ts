import CLI from '@/cli'
import Server from '@/server'
import { CommandDefinition } from '..'

const stopCommand: CommandDefinition = {
  name: 'stop',
  exec: async (cmdInfo) => {
    const { cli, server } = cmdInfo as { cli: CLI, server: Server }
    cli.stop()
    await server.stop()
  }
}

export default stopCommand