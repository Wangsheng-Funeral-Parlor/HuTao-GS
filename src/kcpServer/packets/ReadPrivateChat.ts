import Packet, { PacketInterface, PacketContext } from "#/packet"
import { RetcodeEnum } from "@/types/proto/enum"

export interface ReadPrivateChatReq {
  targetUid: number
}

export interface ReadPrivateChatRsp {
  retcode: RetcodeEnum
}

class ReadPrivateChatPacket extends Packet implements PacketInterface {
  constructor() {
    super("ReadPrivateChat")
  }

  async request(context: PacketContext, _data: ReadPrivateChatReq): Promise<void> {
    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: ReadPrivateChatRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ReadPrivateChatPacket
export default (() => (packet = packet || new ReadPrivateChatPacket()))()
