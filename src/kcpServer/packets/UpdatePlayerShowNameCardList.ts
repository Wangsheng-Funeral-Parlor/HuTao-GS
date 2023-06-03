import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface UpdatePlayerShowNameCardListReq {
  showNameCardIdList: number[]
}

export interface UpdatePlayerShowNameCardListRsp {
  retcode: RetcodeEnum
  showNameCardIdList: number[]
}

class UpdatePlayerShowNameCardListPacket extends Packet implements PacketInterface {
  constructor() {
    super("UpdatePlayerShowNameCardList", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: UpdatePlayerShowNameCardListReq): Promise<void> {
    const { profile } = context.player
    const { showNameCardIdList } = data

    profile.showNameCardIdList = showNameCardIdList

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      showNameCardIdList: profile.showNameCardIdList,
    })
  }

  async response(context: PacketContext, data: UpdatePlayerShowNameCardListRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: UpdatePlayerShowNameCardListPacket
export default (() => (packet = packet || new UpdatePlayerShowNameCardListPacket()))()
