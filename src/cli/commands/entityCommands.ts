import Gadget from '$/entity/gadget'
import Monster from '$/entity/monster'
import Vector from '$/utils/vector'
import { PlayerDieTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
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

      print('Spawning monster:', args[0])

      const entity = new Monster(args[0], player)

      entity.motion.pos.copy(pos)
      entity.bornPos.copy(pos)

      await entity.initNew(args[1])
      await currentScene.entityManager.add(entity)
    }
  },
  {
    name: 'gadget',
    desc: 'Spawn gadget',
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

      print('Spawning gadget:', args[0])

      const entity = new Gadget(args[0])

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
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentScene, pos } = player
      if (!currentScene || !pos) {
        printError('Unable to get player position.')
        return
      }

      print('Spawning vehicle')

      await currentScene.vehicleManager.createVehicle(player, 45001001, 0, pos, new Vector())
    }
  },
  {
    name: 'killall',
    desc: 'Kill all nearby monsters (32 Max)',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentScene, currentAvatar, loadedEntityIdList } = player
      if (!currentAvatar) {
        printError('Current avatar is null.')
        return
      }
      if (!currentScene) {
        printError('Not in scene.')
        return
      }

      print('Killing monsters')

      const { entityManager } = currentScene
      const entityList = loadedEntityIdList
        .map(id => entityManager.getEntity(id, true))
        .filter(e => e != null && e.protEntityType === ProtEntityTypeEnum.PROT_ENTITY_MONSTER && e.isAlive())
        .sort((a, b) => Math.sign(a.distanceTo2D(currentAvatar) - b.distanceTo2D(currentAvatar)))

      let i = 0
      for (const entity of entityList) {
        if (i++ > 32) break
        await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, undefined, true)
      }

      await entityManager.flushAll()
    }
  }
]

export default entityCommands
