import Reliquary from '$/equip/reliquary'
import ReliquaryData from '$/gameData/data/ReliquaryData'
import translate from '@/translate'
import { CommandDefinition } from '..'

const artSetCommand: CommandDefinition = {
  name: 'artSet',
  usage: 3,
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

    if (!player) return printError(translate('generic.playerNotFound'))

    const setId = args[0]
    const count = args[1] || 1

    const artIdList = (await ReliquaryData.getSet(setId))?.ContainsList
    if (artIdList == null) return printError(translate('cli.commands.artSet.error.setNotFound'))

    print(translate('cli.commands.artSet.info.give', setId, count))

    for (let i = 0; i < count; i++) {
      for (const id of artIdList) {
        const reliquary = new Reliquary(id, player)
        await reliquary.initNew()
        if (!await player.inventory.add(reliquary)) return printError(translate('generic.inventoryFull'))
      }
    }
  }
}

export default artSetCommand