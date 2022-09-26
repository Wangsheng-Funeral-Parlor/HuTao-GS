import translate from '@/translate'
import { CommandDefinition } from '..'

const scoinCommand: CommandDefinition = {
  name: 'scoin',
  usage: 2,
  args: [
    { name: 'amount', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const amount = args[0]

    print(translate('cli.commands.scoin.info.give', amount))

    player.addMora(amount)
  }
}

export default scoinCommand