import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/enum/retcode'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import SceneData from '$/gameData/data/SceneData'
import { ClientState } from '@/types/enum/state'

export interface SceneTransToPointReq {
  sceneId: number
  pointId: number
}

export interface SceneTransToPointRsp {
  retcode: RetcodeEnum
  sceneId?: number
  pointId?: number
}

class SceneTransToPointPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneTransToPoint', {
      reqWaitState: ClientState.IN_GAME | ClientState.SCENE_WORLD,
      reqWaitStateMask: 0xFF00
    })
  }

  async request(context: PacketContext, data: SceneTransToPointReq): Promise<void> {
    const { player } = context
    const { currentWorld, currentScene } = player

    const { sceneId, pointId } = data

    const scene = currentWorld.getScene(sceneId)
    const { TranPos, TranRot } = SceneData.getScenePoint(sceneId, pointId) || {}

    if (!scene) {
      await this.response(context, { retcode: RetcodeEnum.RET_CUR_PLAY_CANNOT_TRANSFER })
      return
    }

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(TranPos)
    rot.setData(TranRot)

    await scene.join(context, pos, rot, currentScene?.id === sceneId ? SceneEnterTypeEnum.ENTER_GOTO : SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      sceneId,
      pointId
    })
  }

  async response(context: PacketContext, data: SceneTransToPointRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SceneTransToPointPacket
export default (() => packet = packet || new SceneTransToPointPacket())()