import { CommandDefinition } from '..'

const scoinCommand: CommandDefinition = {
  name: 'scoin',
  desc: 'Give mora',
  usage: [
    'scoin <amount> <uid> - Give mora to player',
    'scoin <amount>       - (In game) Give mora to yourself'
  ],
  args: [
    { name: 'amount', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError('Player not found.')

    const amount = args[0]

    print('Give mora:', amount)

    player.addMora(amount)
  }
}

export default scoinCommand