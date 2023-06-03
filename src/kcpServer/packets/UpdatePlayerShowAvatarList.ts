import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface UpdatePlayerShowAvatarListReq {
  showAvatarIdList: number[]
  isShowAvatar: boolean
}

export interface UpdatePlayerShowAvatarListRsp {
  retcode: RetcodeEnum
  showAvatarIdList: number[]
  isShowAvatar: boolean
}

class UpdatePlayerShowAvatarListPacket extends Packet implements PacketInterface {
  constructor() {
    super("UpdatePlayerShowAvatarList", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: UpdatePlayerShowAvatarListReq): Promise<void> {
    const { profile } = context.player
    const { showAvatarIdList, isShowAvatar } = data

    profile.setShowAvatarInfo(showAvatarIdList, !!isShowAvatar)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      showAvatarIdList: profile.showAvatarList.map((avatar) => avatar.avatarId),
      isShowAvatar,
    })
  }

  async response(context: PacketContext, data: UpdatePlayerShowAvatarListRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: UpdatePlayerShowAvatarListPacket
export default (() => (packet = packet || new UpdatePlayerShowAvatarListPacket()))()
