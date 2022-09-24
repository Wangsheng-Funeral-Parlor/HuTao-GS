import { CommandDefinition } from '..'

const godCommand: CommandDefinition = {
  name: 'god',
  desc: 'Toggle god mode',
  usage: [
    'god <uid> - Toggle god mode for player',
    'god       - (In game) Toggle god mode for yourself'
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

    player.godMode = !player.godMode

    print(`God mode ${player.godMode ? 'enabled' : 'disabled'}.`)
  }
}

export default godCommand