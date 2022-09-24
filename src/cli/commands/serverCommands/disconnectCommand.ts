import { CommandDefinition } from '..'

const disconnectCommand: CommandDefinition = {
  name: 'disconnect',
  desc: 'Disconnect client',
  usage: [
    'disconnect <UID|ID> <reason> - Disconnect client',
    'disconnect <UID|ID>          - Same but reason is set to ENET_SERVER_KICK'
  ],
  args: [
    { name: 'UID|ID' },
    { name: 'reason', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    cli.print('Attempt to disconnect:', args[0])
    if (!await kcpServer.disconnect(parseInt(args[0], 16), args[1])) await kcpServer.disconnectUid(parseInt(args[0]), args[1])
  }
}

export default disconnectCommand