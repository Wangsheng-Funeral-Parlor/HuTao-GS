import translate from '@/translate'
import { CommandDefinition } from '..'

const scriptCommand: CommandDefinition = {
  name: 'script',
  args: [
    { name: 'name', type: 'str' },
    { name: 'uid', type: 'int' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1])

    if (!player) return printError(translate('generic.playerNotFound'))

    if (await player.windyRce(args[0])) print('Sending script to client.')
    else printError(translate('cli.commands.script.error.scriptNotFound'))
  }
}

export default scriptCommand