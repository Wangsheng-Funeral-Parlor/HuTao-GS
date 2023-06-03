import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { ActivityInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetActivityInfoReq {
  activityIdList: number[]
}

export interface GetActivityInfoRsp {
  retcode: RetcodeEnum
  activityInfoList: ActivityInfo[]
  activatedSaleIdList: number[]
  disableTransferPointInteractionList: { key: number; value: number }[]
}

class GetActivityInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetActivityInfo", {
      reqWaitState: ClientStateEnum.POST_LOGIN,
      reqWaitStatePass: true,
    })
  }

  async request(context: PacketContext, data: GetActivityInfoReq): Promise<void> {
    const { game, player } = context
    const { activityIdList } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      activityInfoList: game.activityManager.exportActivityInfoList(player, activityIdList),
      activatedSaleIdList: [],
      disableTransferPointInteractionList: [],
    })
  }

  async response(context: PacketContext, data: GetActivityInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetActivityInfoPacket
export default (() => (packet = packet || new GetActivityInfoPacket()))()
