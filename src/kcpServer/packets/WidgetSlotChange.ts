import Packet, { PacketInterface, PacketContext } from '#/packet'
import { WidgetSlotOpEnum } from '@/types/enum/widget'
import { WidgetSlotData } from '@/types/game/widget'

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