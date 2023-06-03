import Packet, { PacketContext, PacketInterface } from "#/packet"
import SceneData from "$/gameData/data/SceneData"
import { ClientStateEnum } from "@/types/enum"
import { CityInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetSceneAreaReq {
  sceneId: number
  belongUid: number
}

export interface GetSceneAreaRsp {
  retcode: RetcodeEnum
  sceneId?: number
  areaIdList?: number[]
  cityInfoList?: CityInfo[]
}

class GetSceneAreaPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetSceneArea", {
      reqWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH,
      reqWaitStatePass: true,
    })
  }

  async request(context: PacketContext, data: GetSceneAreaReq): Promise<void> {
    const { sceneId } = data
    const sceneData = await SceneData.getScene(sceneId)

    if (sceneData == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_SVR_ERROR })
      return
    }

    const areaIdList = []
    const cityInfoList = []

    for (const cityConfig of sceneData.City) {
      const { Id, AreaIdVec } = cityConfig

      areaIdList.push(...AreaIdVec)
      cityInfoList.push({
        cityId: Id,
        level: 1,
      })
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      sceneId,
      areaIdList,
      cityInfoList,
    })
  }

  async response(context: PacketContext, data: GetSceneAreaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetSceneAreaPacket
export default (() => (packet = packet || new GetSceneAreaPacket()))()
