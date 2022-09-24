import { CommandDefinition } from '..'

const posCommand: CommandDefinition = {
  name: 'pos',
  desc: 'Print current position',
  usage: [
    'pos <uid> - Print player current position',
    'pos       - (In game) Print your current position'
  ],
  args: [
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

    if (!player) return printError('Player not found.')

    const pos = player.pos
    if (!pos) return printError('Unable to get player position.')

    print('Scene:', player.currentScene?.id || '?', 'X:', pos.x, 'Y:', pos.y, 'Z:', pos.z)
  }
}

export default posCommand