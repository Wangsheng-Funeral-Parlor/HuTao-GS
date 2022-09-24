import { CommandDefinition } from '..'

const mcoinCommand: CommandDefinition = {
  name: 'mcoin',
  desc: 'Give genesis crystal',
  usage: [
    'mcoin <amount> <uid> - Give genesis crystal to player',
    'mcoin <amount>       - (In game) Give genesis crystal to yourself'
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

    print('Give genesis crystal:', amount)

    player.addGenesisCrystal(amount)
  }
}

export default mcoinCommand