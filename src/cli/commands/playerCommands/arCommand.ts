import { CommandDefinition } from '..'

const arCommand: CommandDefinition = {
  name: 'ar',
  desc: 'Set adventure rank',
  usage: [
    'ar <level> <uid> - Set adventure rank for player',
    'ar <level>       - (In game) Set adventure rank for yourself'
  ],
  args: [
    { name: 'level', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError('Player not found.')

    await player.setLevel(args[0])
    print(`Adventure rank set to: ${player.level}`)
  }
}

export default arCommand