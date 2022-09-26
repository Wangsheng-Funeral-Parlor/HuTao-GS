import translate from '@/translate'
import { CommandDefinition } from '..'

const disconnectCommand: CommandDefinition = {
  name: 'disconnect',
  usage: 2,
  args: [
    { name: 'UID|ID' },
    { name: 'reason', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    cli.print(translate('cli.commands.disconnect.info.disconnect', args[0]))
    if (!await kcpServer.disconnect(parseInt(args[0], 16), args[1])) await kcpServer.disconnectUid(parseInt(args[0]), args[1])
  }
}

export default disconnectCommand