import Packet, { PacketContext, PacketInterface } from '#/packet'
import { WidgetSlotData } from '@/types/proto'
import { WidgetSlotOpEnum } from '@/types/proto/enum'

export interface WidgetSlotChangeNotify {
  op: WidgetSlotOpEnum
  slot: WidgetSlotData
}

class WidgetSlotChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('WidgetSlotChange')
  }

  async sendNotify(context: PacketContext, data: WidgetSlotChangeNotify): Promise<void> {
    await super.sendNotify(context, data)
  }
}

let packet: WidgetSlotChangePacket
export default (() => packet = packet || new WidgetSlotChangePacket())()