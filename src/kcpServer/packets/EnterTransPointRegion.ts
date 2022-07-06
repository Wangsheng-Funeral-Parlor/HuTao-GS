import Packet, { PacketInterface, PacketContext } from '#/packet'
import SceneData from '$/gameData/data/SceneData'
import SceneTransPoint from '@/types/gameData/BinOutput/ScenePoint/Point/SceneTransPoint'
import { ClientState } from '@/types/enum/state'

export interface EnterTransPointRegionNotify {
  sceneId: number
  pointId: number
}

class EnterTransPointRegionPacket extends Packet implements PacketInterface {
  constructor() {
    super('EnterTransPointRegion', {
      reqState: ClientState.IN_GAME,
      reqStateMask: 0xF000
    })
  }

  async recvNotify(context: PacketContext, data: EnterTransPointRegionNotify): Promise<void> {
    const { player } = context
    const { sceneId, pointId } = data

    const scenePointData = await SceneData.getScenePoint(sceneId, pointId) as SceneTransPoint
    if (scenePointData.Type !== 'TOWER') return

    player.teamManager.getTeam()?.reviveAllAvatar()
  }
}

let packet: EnterTransPointRegionPacket
export default (() => packet = packet || new EnterTransPointRegionPacket())()