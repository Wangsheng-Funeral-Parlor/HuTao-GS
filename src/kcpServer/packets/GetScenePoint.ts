import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import SceneData from '$/gameData/data/SceneData'
import { ClientStateEnum } from '@/types/enum'

const unlockType = [
  'SceneTransPoint',
  'DungeonEntry',
  'VirtualTransPoint'
]

export interface GetScenePointReq {
  sceneId: number
  belongUid?: number
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
      reqWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, data: GetScenePointReq): Promise<void> {
    const { player } = context
    const { hostWorld, currentWorld } = player
    const { sceneId, belongUid } = data

    const world = belongUid === currentWorld.host.uid ? currentWorld : hostWorld
    const scene = await world.getScene(sceneId, false)
    const sceneData = await SceneData.getScene(sceneId)

    if (scene == null || sceneData == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
      return
    }

    const pointList = []
    const areaList = []

    const scenePointMap = await SceneData.getScenePointMap(sceneId)
    for (const pointId in scenePointMap) {
      const { $type, Unlocked } = scenePointMap[pointId]
      if (!unlockType.includes($type) || Unlocked) continue

      pointList.push(pointId)
    }

    // add unlocked points
    pointList.push(...scene.unlockedPointList.filter(id => !pointList.includes(id)))

    for (const cityConfig of sceneData.City) areaList.push(...cityConfig.AreaIdVec)

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