import Packet, { PacketContext, PacketInterface } from "#/packet"
import Vector from "$/utils/vector"
import { ClientStateEnum } from "@/types/enum"
import { VectorInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface ChangeAvatarReq {
  guid: string
  skillId: number
  isMove: boolean
  movePos: VectorInfo
}

export interface ChangeAvatarRsp {
  retcode: RetcodeEnum
  curGuid?: string
  skillId?: number
}

class ChangeAvatarPacket extends Packet implements PacketInterface {
  constructor() {
    super("ChangeAvatar", {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xf0ff,
    })
  }

  async request(context: PacketContext, data: ChangeAvatarReq): Promise<void> {
    const { player, seqId } = context
    const { state } = player
    const { guid, skillId, isMove, movePos } = data

    // Set client state
    player.state = (state & 0xff00) | ClientStateEnum.CHANGE_AVATAR

    const team = player.teamManager.getTeam()
    const avatar = team.getAvatar(BigInt(guid))
    const retcode = await player.changeAvatar(
      avatar,
      isMove ? new Vector(movePos.x, movePos.y, movePos.z) : undefined,
      seqId
    )

    await this.response(context, {
      retcode,
      curGuid: guid,
      skillId,
    })

    // Set client state
    player.state = state & 0xff00
  }

  async response(context: PacketContext, data: ChangeAvatarRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ChangeAvatarPacket
export default (() => (packet = packet || new ChangeAvatarPacket()))()
