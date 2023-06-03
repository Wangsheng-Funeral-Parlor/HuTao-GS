import Packet, { PacketContext, PacketInterface } from "#/packet"
import SceneData from "$/gameData/data/SceneData"
import Vector from "$/utils/vector"
import PersonalSceneJumpPoint from "$DT/BinOutput/Config/ConfigScenePoint/Child/PersonalSceneJumpPoint"
import { ClientStateEnum } from "@/types/enum"
import { VectorInfo } from "@/types/proto"
import { RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from "@/types/proto/enum"

export interface PersonalSceneJumpReq {
  pointId: number
}

export interface PersonalSceneJumpRsp {
  retcode: RetcodeEnum
  destSceneId?: number
  destPos?: VectorInfo
}

class PersonalSceneJumpPacket extends Packet implements PacketInterface {
  constructor() {
    super("PersonalSceneJump", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PersonalSceneJumpReq): Promise<void> {
    const { player } = context
    const { currentWorld, currentScene } = player
    const { pointId } = data

    const { TranSceneId, TranPos, TranRot } =
      <PersonalSceneJumpPoint>await SceneData.getScenePoint(currentScene.id, pointId) || {}
    const scene = await currentWorld.getScene(TranSceneId)

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
      destPos: pos.export(),
    })
  }

  async response(context: PacketContext, data: PersonalSceneJumpRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PersonalSceneJumpPacket
export default (() => (packet = packet || new PersonalSceneJumpPacket()))()
