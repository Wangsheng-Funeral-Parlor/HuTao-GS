import { CommandDefinition } from '..'

const healCommand: CommandDefinition = {
  name: 'heal',
  desc: 'Heal all avatar in current team',
  usage: [
    'heal <uid> - Heal all avatar in player\'s current team',
    'heal       - (In game) Heal all avatar in current team'
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

    const avatarList = player.teamManager.getTeam()?.avatarList || []
    for (const avatar of avatarList) {
      if (!avatar.isAlive()) await avatar.revive()
      await avatar.fullHeal(true)
    }

    print('Healed all avatar.')
  }
}

export default healCommand