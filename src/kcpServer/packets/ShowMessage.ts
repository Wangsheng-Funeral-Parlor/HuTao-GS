import Packet, { PacketInterface, PacketContext } from '#/packet'
import { SvrMsgIdEnum } from '@/types/enum/message'
import { MsgParam } from '@/types/game/message'

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