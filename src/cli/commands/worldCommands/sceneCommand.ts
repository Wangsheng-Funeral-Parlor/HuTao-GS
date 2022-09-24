import SceneData from '$/gameData/data/SceneData'
import Vector from '$/utils/vector'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const sceneCommand: CommandDefinition = {
  name: 'scene',
  desc: 'Change scene',
  usage: [
    'scene <id> <uid> - Change scene for player',
    'scene <id>       - (In game) Change scene for yourself'
  ],
  args: [
    { name: 'id', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError('Player not found.')

    const { currentWorld, currentScene, context } = player
    if (!currentWorld) return printError('Not in world.')

    const scene = await currentWorld.getScene(args[0])
    const sceneData = await SceneData.getScene(args[0])
    if (!scene || !sceneData) return printError('Scene not found.')
    if (currentScene === scene) return printError('Same scene.')

    print('Change scene to:', scene.id)

    const { BornPos, BornRot } = sceneData

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(BornPos)
    rot.setData(BornRot)

    scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
  }
}

export default sceneCommand