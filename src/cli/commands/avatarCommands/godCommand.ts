import translate from '@/translate'
import { CommandDefinition } from '..'

const godCommand: CommandDefinition = {
  name: 'god',
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

    player.godMode = !player.godMode

    if (player.godMode) print(translate('cli.commands.god.info.enable'))
    else print(translate('cli.commands.god.info.disable'))
  }
}

export default godCommand