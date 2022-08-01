import Packet, { PacketInterface, PacketContext } from '#/packet'
import SceneData from '$/gameData/data/SceneData'
import Scene from '$/scene'

const unlockType = [
  'SceneTransPoint',
  'DungeonEntry',
  'VirtualTransPoint'
]

export interface ScenePointUnlockNotify {
  sceneId: number
  pointList: number[]
  lockedPointList: number[]
  hidePointList: number[]
  unhidePointList: number[]
}

class ScenePointUnlockPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePointUnlock')
  }

  async sendNotify(context: PacketContext, scene: Scene): Promise<void> {
    const { id: sceneId, unlockedPointList } = scene

    const pointList = []

    const scenePointMap = await SceneData.getScenePointMap(sceneId)
    for (const pointId in scenePointMap) {
      const { $type, Unlocked } = scenePointMap[pointId]
      if (!unlockType.includes($type) || Unlocked) continue

      pointList.push(pointId)
    }

    // add unlocked points
    pointList.push(...unlockedPointList.filter(id => !pointList.includes(id)))

    const notifyData: ScenePointUnlockNotify = {
      sceneId,
      pointList,
      lockedPointList: [],
      hidePointList: [],
      unhidePointList: []
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], scene: Scene): Promise<void> {
    await super.broadcastNotify(contextList, scene)
  }
}

let packet: ScenePointUnlockPacket
export default (() => packet = packet || new ScenePointUnlockPacket())()