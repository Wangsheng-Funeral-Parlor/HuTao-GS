import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { AnchorPointData, ClientCollectorData, LunchBoxData, OneoffGatherPointDetectorData, WidgetCoolDownData, WidgetSlotData } from '@/types/proto'

export interface AllWidgetDataNotify {
  anchorPointList: AnchorPointData[]
  nextAnchorPointUsableTime: number
  lunchBoxData: LunchBoxData
  oneoffGatherPointDetectorDataList: OneoffGatherPointDetectorData[]
  clientCollectorDataList: ClientCollectorData[]
  coolDownGroupDataList: WidgetCoolDownData[]
  normalCoolDownDataList: WidgetCoolDownData[]
  slotList: WidgetSlotData[]
}

class AllWidgetDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('AllWidgetData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN, true) || !context.player) return
    await super.sendNotify(context, context.player.widget.exportAll())
  }
}

let packet: AllWidgetDataPacket
export default (() => packet = packet || new AllWidgetDataPacket())()