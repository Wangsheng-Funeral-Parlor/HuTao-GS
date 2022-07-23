import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import SceneData from '$/gameData/data/SceneData'
import { ClientState } from '@/types/enum/state'
import SceneTransPoint from '@/types/gameData/BinOutput/ScenePoint/Point/SceneTransPoint'

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
    const { currentWorld, currentScene, currentAvatar } = player

    const { sceneId, pointId } = data

    const scene = await currentWorld.getScene(sceneId)
    const { Type, TranPos, TranRot } = <SceneTransPoint>(await SceneData.getScenePoint(sceneId, pointId)) || {}

    if (!scene || !TranPos) {
      await this.response(context, { retcode: RetcodeEnum.RET_POINT_NOT_UNLOCKED })
      return
    }

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(TranPos || {})
    rot.setData(TranRot || {})

    let enterType = SceneEnterTypeEnum.ENTER_JUMP
    if (currentScene?.id === sceneId) {
      currentAvatar.motionInfo.standby()

      if (Type === 'PORTAL') {
        currentAvatar.motionInfo.params = [new Vector(), new Vector()]
        enterType = SceneEnterTypeEnum.ENTER_GOTO_BY_PORTAL
      } else {
        enterType = SceneEnterTypeEnum.ENTER_GOTO
      }
    }

    await scene.join(context, pos, rot, enterType, SceneEnterReasonEnum.TRANS_POINT)

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