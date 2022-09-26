import translate from '@/translate'
import { CommandDefinition } from '..'

const arCommand: CommandDefinition = {
  name: 'ar',
  usage: 2,
  args: [
    { name: 'level', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    await player.setLevel(args[0])
    print(translate('cli.commands.ar.info.setAR', player.level))
  }
}

export default arCommand