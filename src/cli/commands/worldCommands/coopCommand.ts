import translate from '@/translate'
import { CommandDefinition } from '..'

const coopCommand: CommandDefinition = {
  name: 'coop',
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
    if (player.isInMp()) return printError(translate('cli.commands.coop.error.inCoop'))

    print(translate('cli.commands.coop.info.changeToCoop'))
    player.hostWorld.changeToMp()
  }
}

export default coopCommand