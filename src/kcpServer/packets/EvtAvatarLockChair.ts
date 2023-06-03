import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { VectorInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface EvtAvatarLockChairReq {
  chairId: number
  position: VectorInfo
}

export interface EvtAvatarLockChairRsp {
  retcode: RetcodeEnum
  entityId: number
  position: VectorInfo
  chairId: number
}

class EvtAvatarLockChairPacket extends Packet implements PacketInterface {
  constructor() {
    super("EvtAvatarLockChair", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: EvtAvatarLockChairReq): Promise<void> {
    const { currentAvatar } = context.player
    if (!currentAvatar) return

    const { chairId, position } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId: currentAvatar.entityId,
      position,
      chairId,
    })
  }

  async response(context: PacketContext, data: EvtAvatarLockChairRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EvtAvatarLockChairPacket
export default (() => (packet = packet || new EvtAvatarLockChairPacket()))()
