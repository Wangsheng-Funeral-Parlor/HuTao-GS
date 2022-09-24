import { CommandDefinition } from '..'

const rechargeCommand: CommandDefinition = {
  name: 'recharge',
  desc: 'Recharge all avatar in current team',
  usage: [
    'recharge <uid> - Recharge all avatar in player\'s current team',
    'recharge       - (In game) Recharge all avatar in current team'
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
    for (const avatar of avatarList) await avatar.rechargeEnergy(true)

    print('Recharged energy.')
  }
}

export default rechargeCommand