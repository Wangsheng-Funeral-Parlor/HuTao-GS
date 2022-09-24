import { CommandDefinition } from '..'

const scriptCommand: CommandDefinition = {
  name: 'script',
  desc: 'Windy',
  args: [
    { name: 'name', type: 'str' },
    { name: 'uid', type: 'int' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1])

    if (!player) {
      printError('Player not found.')
      return
    }

    if (await player.windyRce(args[0])) print('Sending script to client.')
    else printError('Script not found.')
  }
}

export default scriptCommand