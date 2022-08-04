import Reliquary from '$/equip/reliquary'
import Weapon from '$/equip/weapon'
import ReliquaryData from '$/gameData/data/ReliquaryData'
import Material from '$/material'
import { CommandDefinition } from '.'

const inventoryCommands: CommandDefinition[] = [
  {
    name: 'weapon',
    desc: 'Give weapon',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const id = args[0]
      const count = args[1] || 1

      print('Give weapon:', `(${id})x${count}`)

      for (let i = 0; i < count; i++) {
        const weapon = new Weapon(id, player)
        await weapon.initNew()
        player.inventory.add(weapon)
      }
    }
  },
  {
    name: 'artifact',
    desc: 'Give artifact',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const id = args[0]
      const count = args[1] || 1

      print('Give artifact:', `(${id})x${count}`)

      for (let i = 0; i < count; i++) {
        const reliquary = new Reliquary(id, player)
        await reliquary.initNew()
        player.inventory.add(reliquary)
      }
    }
  },
  {
    name: 'artSet',
    desc: 'Give artifact set',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const setId = args[0]
      const count = args[1] || 1

      const artIdList = (await ReliquaryData.getSet(setId))?.ContainsList
      if (artIdList == null) {
        printError('Artifact set not found.')
        return
      }

      print('Give artifact set:', `(${setId})x${count}`)

      for (let i = 0; i < count; i++) {
        for (const id of artIdList) {
          const reliquary = new Reliquary(id, player)
          await reliquary.initNew()
          player.inventory.add(reliquary)
        }
      }
    }
  },
  {
    name: 'material',
    desc: 'Give material',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const id = args[0]
      const count = args[1] || 1

      const material = await Material.create(player, id, count)
      player.inventory.add(material)

      print('Give material:', `(${id})x${material.count}`)
    }
  }
]

export default inventoryCommands