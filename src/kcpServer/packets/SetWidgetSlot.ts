import Packet, { PacketContext, PacketInterface } from '#/packet';
import { ClientStateEnum } from '@/types/enum';
import { RetcodeEnum, WidgetSlotOpEnum, WidgetSlotTagEnum } from '@/types/proto/enum';

export interface SetWidgetSlotReq {
  op: WidgetSlotOpEnum
  tagList: WidgetSlotTagEnum[]
  materialId: number
}

export interface SetWidgetSlotRsp {
  retcode: RetcodeEnum
  op?: WidgetSlotOpEnum
  tagList?: WidgetSlotTagEnum[]
  materialId?: number
}

class SetWidgetSlotPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetWidgetSlot', {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: SetWidgetSlotReq): Promise<void> {
    const { widget } = context.player
    const { op, tagList, materialId } = data

    if (tagList.length === 0) tagList.push(WidgetSlotTagEnum.WIDGET_SLOT_QUICK_USE)

    for (const tag of tagList) {
      switch (op) {
        case WidgetSlotOpEnum.ATTACH:
          await widget.attach(tag, materialId)
          break
        case WidgetSlotOpEnum.DETACH:
          await widget.detach(tag)
          break
        default:
          await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
          return
      }
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      op,
      tagList,
      materialId
    })
  }

  async response(context: PacketContext, data: SetWidgetSlotRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetWidgetSlotPacket
export default (() => packet = packet || new SetWidgetSlotPacket())()