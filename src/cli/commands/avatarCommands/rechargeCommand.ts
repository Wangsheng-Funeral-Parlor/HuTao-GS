import translate from '@/translate'
import { CommandDefinition } from '..'

const rechargeCommand: CommandDefinition = {
  name: 'recharge',
  usage: 2,
  args: [
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const avatarList = player.teamManager.getTeam()?.avatarList || []
    for (const avatar of avatarList) await avatar.rechargeEnergy(true)

    print(translate('cli.commands.recharge.info.recharge'))
  }
}

export default rechargeCommand