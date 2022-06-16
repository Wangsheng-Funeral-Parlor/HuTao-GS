import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/enum/retcode'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { VectorInterface } from '@/types/game/motion'
import SceneData from '$/gameData/data/SceneData'
import PersonalSceneJumpPoint from '@/types/gameData/BinOutput/ScenePoint/Point/PersonalSceneJumpPoint'
import { ClientState } from '@/types/enum/state'

export interface PersonalSceneJumpReq {
  pointId: number
}

export interface PersonalSceneJumpRsp {
  retcode: RetcodeEnum
  destSceneId?: number
  destPos?: VectorInterface
}

class PersonalSceneJumpPacket extends Packet implements PacketInterface {
  constructor() {
    super('PersonalSceneJump', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PersonalSceneJumpReq): Promise<void> {
    const { player } = context
    const { currentWorld, currentScene } = player
    const { pointId } = data

    const { TranSceneId, TranPos, TranRot } = SceneData.getScenePoint(currentScene.id, pointId) as PersonalSceneJumpPoint || {}
    const scene = currentWorld.getScene(TranSceneId)

    if (!scene) {
      await this.response(context, { retcode: RetcodeEnum.RET_CUR_PLAY_CANNOT_TRANSFER })
      return
    }

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(TranPos)
    rot.setData(TranRot)

    await scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.PERSONAL_SCENE)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      destSceneId: currentScene?.id,
      destPos: pos.export()
    })
  }

  async response(context: PacketContext, data: PersonalSceneJumpRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PersonalSceneJumpPacket
export default (() => packet = packet || new PersonalSceneJumpPacket())()