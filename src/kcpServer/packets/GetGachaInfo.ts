import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { GachaInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import { getJson } from "@/utils/json"

export interface GetGachaInfoReq {}

export interface GetGachaInfoRsp {
  retcode: RetcodeEnum
  gachaInfoList?: GachaInfo[]
  gachaRandom?: number
}

class GetGachaInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetGachaInfo", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, _data: GetGachaInfoReq): Promise<void> {
    const notifydata: GetGachaInfoRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      gachaInfoList: getJson("data/gachaInfo.json", []),
      gachaRandom: 1,
    }
    await this.response(context, notifydata)
  }

  async response(context: PacketContext, data: GetGachaInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetGachaInfoPacket
export default (() => (packet = packet || new GetGachaInfoPacket()))()
