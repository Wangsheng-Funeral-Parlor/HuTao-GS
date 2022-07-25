import Packet, { PacketContext, PacketInterface } from '#/packet'
import { MsgParam } from '@/types/proto'
import { SvrMsgIdEnum } from '@/types/proto/enum'

export interface ShowMessageNotify {
  msgId: SvrMsgIdEnum
  params: MsgParam[]
}

class ShowMessagePacket extends Packet implements PacketInterface {
  constructor() {
    super('ShowMessage')
  }

  async sendNotify(context: PacketContext, data: ShowMessageNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: ShowMessageNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: ShowMessagePacket
export default (() => packet = packet || new ShowMessagePacket())()