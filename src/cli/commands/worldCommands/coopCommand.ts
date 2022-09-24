import { CommandDefinition } from '..'

const coopCommand: CommandDefinition = {
  name: 'coop',
  desc: 'Change to coop world',
  usage: [
    'coop <uid> - Change to coop world for player',
    'coop       - (In game) Change to coop world for yourself'
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
    if (player.isInMp()) return printError('Player already in a coop world.')

    print('Changing to coop world...')
    player.hostWorld.changeToMp()
  }
}

export default coopCommand