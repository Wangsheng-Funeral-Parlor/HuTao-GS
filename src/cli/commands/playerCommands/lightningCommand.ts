import translate from '@/translate'
import { CommandDefinition } from '..'

const lightningCommand: CommandDefinition = {
  name: 'lightning',
  args: [
    { name: 'uid', type: 'int' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[0])

    if (!player) return printError(translate('generic.playerNotFound'))

    player.thunderTarget = !player.thunderTarget
    if (player.thunderTarget) print(translate('cli.commands.lightning.info.start'))
    else print(translate('cli.commands.lightning.info.stop'))
  }
}

export default lightningCommand