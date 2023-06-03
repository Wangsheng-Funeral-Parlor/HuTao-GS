import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { ProfilePicture } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SetPlayerHeadImageReq {
  avatarId: number
}

export interface SetPlayerHeadImageRsp {
  retcode: RetcodeEnum
  avatarId: number
  profilePicture: ProfilePicture
}

class SetPlayerHeadImagePacket extends Packet implements PacketInterface {
  constructor() {
    super("SetPlayerHeadImage", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SetPlayerHeadImageReq): Promise<void> {
    const { profilePicture } = context.player.profile
    const { avatarId } = data

    if (avatarId != null) profilePicture.avatarId = avatarId

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      avatarId: profilePicture.avatarId,
      profilePicture,
    })
  }

  async response(context: PacketContext, data: SetPlayerHeadImageRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerHeadImagePacket
export default (() => (packet = packet || new SetPlayerHeadImagePacket()))()
