import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { WidgetSlotData } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetWidgetSlotReq { }

export interface GetWidgetSlotRsp {
  retcode: RetcodeEnum
  slotList?: WidgetSlotData[]
}

class GetWidgetSlotPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetWidgetSlot', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: GetWidgetSlotReq): Promise<void> {
    const { widget } = context.player

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      slotList: widget.exportSlotList()
    })
  }

  async response(context: PacketContext, data: GetWidgetSlotRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetWidgetSlotPacket
export default (() => packet = packet || new GetWidgetSlotPacket())()