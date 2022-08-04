import { CommandDefinition } from '.'

const playerCommands: CommandDefinition[] = [
  {
    name: 'ar',
    desc: 'Set adventure rank',
    args: [
      { name: 'level', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      await player.setLevel(args[0])
      print(`Adventure rank set to: ${player.level}`)
    }
  },
  {
    name: 'scoin',
    desc: 'Give mora',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give mora:', amount)

      player.addMora(amount)
    }
  },
  {
    name: 'hcoin',
    desc: 'Give primogem',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give primogem:', amount)

      player.addPrimogem(amount)
    }
  },
  {
    name: 'mcoin',
    desc: 'Give genesis crystal',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give genesis crystal:', amount)

      player.addGenesisCrystal(amount)
    }
  }
]

export default playerCommands