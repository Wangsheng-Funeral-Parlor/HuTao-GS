import { CommandDefinition } from '..'

const hcoinCommand: CommandDefinition = {
  name: 'hcoin',
  desc: 'Give primogem',
  usage: [
    'hcoin <amount> <uid> - Give primogem to player',
    'hcoin <amount>       - (In game) Give primogem to yourself'
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

    print('Give primogem:', amount)

    player.addPrimogem(amount)
  }
}

export default hcoinCommand