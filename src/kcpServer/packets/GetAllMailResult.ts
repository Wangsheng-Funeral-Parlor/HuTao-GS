import Packet, { PacketInterface, PacketContext } from "#/packet"
import { MailData } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetAllMailResultNotify {
  retcode: RetcodeEnum
  totalPageCount: number
  mailList: MailData[]
  transaction?: string
  isCollected: boolean
  pageIndex: number
}

class GetAllMailResultPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetAllMailResult")
  }

  async recvNotify(_context: PacketContext, _data: GetAllMailResultNotify): Promise<void> {
    return
  }

  async sendNotify(context: PacketContext, notifyData: GetAllMailResultNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: GetAllMailResultPacket
export default (() => (packet = packet || new GetAllMailResultPacket()))()
