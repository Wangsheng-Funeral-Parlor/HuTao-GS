import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import SceneData from '$/gameData/data/SceneData'
import { ClientState } from '@/types/enum/state'

const unlockType = [
  'SceneTransPoint',
  'DungeonEntry',
  'VirtualTransPoint'
]

export interface GetScenePointReq {
  sceneId: number
  belongUid: number
}

export interface GetScenePointRsp {
  retcode: RetcodeEnum
  sceneId?: number
  unlockedPointList?: number[]
  belongUid?: number
  unlockAreaList?: number[]
  lockedPointList?: number[]
  toBeExploreDungeonEntryList?: number[]
  notExploredDungeonEntryList?: number[]
  groupUnlimitPointList?: number[]
  notInteractDungeonEntryList?: number[]
  hidePointList?: number[]
}

class GetScenePointPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetScenePoint', {
      reqWaitState: ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, data: GetScenePointReq): Promise<void> {
    const { sceneId } = data
    const sceneData = await SceneData.getScene(sceneId)

    if (sceneData == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
      return
    }

    const pointList = []
    const areaList = []

    const scenePointMap = await SceneData.getScenePointMap(sceneId)
    for (let pointId in scenePointMap) {
      const { $type, Unlocked } = scenePointMap[pointId]
      if (!unlockType.includes($type) || Unlocked) continue

      pointList.push(pointId)
    }

    for (let cityConfig of sceneData.City) areaList.push(...cityConfig.AreaIdVec)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      sceneId,
      unlockedPointList: pointList,
      unlockAreaList: areaList,
      lockedPointList: [],
      toBeExploreDungeonEntryList: [],
      notExploredDungeonEntryList: [],
      groupUnlimitPointList: [],
      notInteractDungeonEntryList: [],
      hidePointList: []
    })
  }

  async response(context: PacketContext, data: GetScenePointRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetScenePointPacket
export default (() => packet = packet || new GetScenePointPacket())()