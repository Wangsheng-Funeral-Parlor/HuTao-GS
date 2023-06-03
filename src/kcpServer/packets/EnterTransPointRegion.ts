import Packet, { PacketContext, PacketInterface } from "#/packet"
import SceneData from "$/gameData/data/SceneData"
import { ClientStateEnum } from "@/types/enum"

export interface EnterTransPointRegionNotify {
  sceneId: number
  pointId: number
}

class EnterTransPointRegionPacket extends Packet implements PacketInterface {
  constructor() {
    super("EnterTransPointRegion", {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xf000,
    })
  }

  async recvNotify(context: PacketContext, data: EnterTransPointRegionNotify): Promise<void> {
    const { player } = context
    const { sceneId, pointId } = data

    const scenePointData = await SceneData.getScenePoint(sceneId, pointId)
    if (scenePointData?.Type !== "TOWER") return

    player.teamManager.getTeam()?.reviveAllAvatar()
  }
}

let packet: EnterTransPointRegionPacket
export default (() => (packet = packet || new EnterTransPointRegionPacket()))()
