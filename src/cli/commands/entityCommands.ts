import Monster from '$/entity/monster'
import Vector from '$/utils/vector'
import { CommandDefinition } from '.'

const entityCommands: CommandDefinition[] = [
  {
    name: 'monster',
    desc: 'Spawn monster',
    args: [
      { name: 'id', type: 'int' },
      { name: 'lv', type: 'int' },
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

      const { currentScene, pos } = player
      if (!currentScene || !pos) {
        printError('Unable to get player position.')
        return
      }

      print('Attempt to spawn monster:', args[0])

      const entity = new Monster(args[0], player)

      entity.motion.pos.copy(pos)
      entity.bornPos.copy(pos)

      await entity.initNew(args[1])
      await currentScene.entityManager.add(entity)
    }
  },
  {
    name: 'vehicle',
    desc: 'Spawn vehicle',
    args: [
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

      const { currentScene, pos } = player
      if (!currentScene || !pos) {
        printError('Unable to get player position.')
        return
      }

      print('Attempt to spawn vehicle')

      await currentScene.vehicleManager.createVehicle(player, 45001001, 0, pos, new Vector())
    }
  }
]

export default entityCommands