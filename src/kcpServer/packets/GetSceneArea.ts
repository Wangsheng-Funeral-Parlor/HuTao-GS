import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { CityInfo } from '@/types/game/city'
import SceneData from '$/gameData/data/SceneData'
import { ClientState } from '@/types/enum/state'

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
    super('GetSceneArea', {
      reqWaitState: ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, data: GetSceneAreaReq): Promise<void> {
    const { sceneId } = data
    const sceneData = SceneData.getScene(sceneId)

    if (sceneData == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_SVR_ERROR })
      return
    }

    const areaIdList = []
    const cityInfoList = []

    for (let cityConfig of sceneData.City) {
      const { Id, AreaIdVec } = cityConfig

      areaIdList.push(...AreaIdVec)
      cityInfoList.push({
        cityId: Id,
        level: 1
      })
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      sceneId,
      areaIdList,
      cityInfoList
    })
  }

  async response(context: PacketContext, data: GetSceneAreaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetSceneAreaPacket
export default (() => packet = packet || new GetSceneAreaPacket())()