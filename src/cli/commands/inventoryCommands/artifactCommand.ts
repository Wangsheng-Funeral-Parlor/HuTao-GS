import Reliquary from '$/equip/reliquary'
import { CommandDefinition } from '..'

const artifactCommand: CommandDefinition = {
  name: 'artifact',
  desc: 'Give artifact',
  usage: [
    'artifact <id> <count> <uid> - Give artifacts to player',
    'artifact <id> <count>       - (In game) Give artifacts to yourself',
    'artifact <id>               - (In game) Give 1 artifact to yourself'
  ],
  args: [
    { name: 'id', type: 'int' },
    { name: 'count', type: 'int', optional: true },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

    if (!player) return printError('Player not found.')

    const id = args[0]
    const count = args[1] || 1

    print('Give artifact:', `(${id})x${count}`)

    for (let i = 0; i < count; i++) {
      const reliquary = new Reliquary(id, player)
      await reliquary.initNew()
      if (!await player.inventory.add(reliquary)) return printError('Inventory full')
    }
  }
}

export default artifactCommand