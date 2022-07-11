import SceneData from '$/gameData/data/SceneData'
import Vector from '$/utils/vector'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { CommandDefinition } from '.'

const worldCommands: CommandDefinition[] = [
  {
    name: 'coop',
    desc: 'Change to coop world',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }
      if (player.isInMp()) {
        printError('Player already in a coop world.')
        return
      }

      print('Changing to coop world.')

      player.hostWorld.changeToMp()
    }
  },
  {
    name: 'pos',
    desc: 'Print current position',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const pos = player.pos
      if (!pos) {
        printError('Unable to get player position.')
        return
      }

      print('Scene:', player.currentScene?.id || '?', 'X:', pos.X, 'Y:', pos.Y, 'Z:', pos.Z)
    }
  },
  {
    name: 'scene',
    desc: 'Change scene',
    args: [
      { name: 'id', type: 'int' },
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

      const { currentWorld, currentScene, context } = player
      if (!currentWorld) {
        printError('Not in world.')
        return
      }

      const scene = await currentWorld.getScene(args[0])
      const sceneData = await SceneData.getScene(args[0])
      if (!scene || !sceneData) {
        printError('Scene not found.')
        return
      }
      if (currentScene === scene) {
        printError('Same scene.')
        return
      }

      print('Change scene to:', scene.id)

      const { BornPos, BornRot } = sceneData

      const pos = new Vector()
      const rot = new Vector()

      pos.setData(BornPos)
      rot.setData(BornRot)

      scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
    }
  },
  {
    name: 'tp',
    desc: 'Teleport to location',
    args: [
      { name: 'x', type: 'int' },
      { name: 'y', type: 'int' },
      { name: 'z', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[3] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentScene, context } = player
      if (!currentScene) {
        printError('Not in scene.')
        return
      }

      const x = args[0]
      const y = args[1]
      const z = args[2]

      print('Teleport to:', x, y, z)

      currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
    }
  }
]

export default worldCommands