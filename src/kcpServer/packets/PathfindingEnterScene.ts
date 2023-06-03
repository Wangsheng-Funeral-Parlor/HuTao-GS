import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ObstacleInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface PathfindingEnterSceneReq {
  sceneId?: number
  version?: number
  obstacles?: ObstacleInfo[]
  isEditor?: boolean
  activityId?: number[]
}

export interface PathfindingEnterSceneRsp {
  retcode: RetcodeEnum
}

class PathfindingEnterScenePacket extends Packet implements PacketInterface {
  constructor() {
    super("PathfindingEnterScene")
  }

  async request(context: PacketContext, _data: PathfindingEnterSceneReq): Promise<void> {
    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: PathfindingEnterSceneRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PathfindingEnterScenePacket
export default (() => (packet = packet || new PathfindingEnterScenePacket()))()
