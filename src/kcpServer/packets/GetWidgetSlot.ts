import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { WidgetSlotData } from '@/types/game/widget'

export interface GetWidgetSlotReq { }

export interface GetWidgetSlotRsp {
  retcode: RetcodeEnum
  slotList?: WidgetSlotData[]
}

class GetWidgetSlotPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetWidgetSlot', {
      reqState: ClientState.POST_LOGIN,
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