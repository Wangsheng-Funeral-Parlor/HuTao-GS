import Packet, { PacketContext, PacketInterface } from "#/packet"
import { H5ActivityInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetAllH5ActivityInfoReq {}

export interface GetAllH5ActivityInfoRsp {
  retcode: RetcodeEnum
  h5ActivityInfoList: H5ActivityInfo[]
  clientRedDotTimestamp?: number
}

class GetAllH5ActivityInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetAllH5ActivityInfo")
  }

  async request(context: PacketContext, _data: GetAllH5ActivityInfoReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      h5ActivityInfoList: [],
    })
  }

  async response(context: PacketContext, data: GetAllH5ActivityInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetAllH5ActivityInfoPacket
export default (() => (packet = packet || new GetAllH5ActivityInfoPacket()))()
