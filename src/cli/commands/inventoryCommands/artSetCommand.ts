import Reliquary from '$/equip/reliquary'
import ReliquaryData from '$/gameData/data/ReliquaryData'
import { CommandDefinition } from '..'

const artSetCommand: CommandDefinition = {
  name: 'artSet',
  desc: 'Give artifact set',
  usage: [
    'artSet <id> <count> <uid> - Give artifact sets to player',
    'artSet <id> <count>       - (In game) Give artifact sets to yourself',
    'artSet <id>               - (In game) Give 1 artifact set to yourself'
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

    const setId = args[0]
    const count = args[1] || 1

    const artIdList = (await ReliquaryData.getSet(setId))?.ContainsList
    if (artIdList == null) return printError('Artifact set not found.')

    print('Give artifact set:', `(${setId})x${count}`)

    for (let i = 0; i < count; i++) {
      for (const id of artIdList) {
        const reliquary = new Reliquary(id, player)
        await reliquary.initNew()
        if (!await player.inventory.add(reliquary)) return printError('Inventory full')
      }
    }
  }
}

export default artSetCommand