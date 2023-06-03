import Player from ".."

import WidgetData from "./widgetData"

import { AllWidgetDataNotify } from "#/packets/AllWidgetData"
import WidgetSlotChange from "#/packets/WidgetSlotChange"
import { WidgetSlotData } from "@/types/proto"
import { WidgetSlotOpEnum, WidgetSlotTagEnum } from "@/types/proto/enum"
import WidgetUserData from "@/types/user/WidgetUserData"

export default class Widget {
  player: Player

  widgetData: WidgetData
  slotMap: { [tag: number]: number | null }

  constructor(player: Player) {
    this.player = player

    this.widgetData = new WidgetData(this)
    this.slotMap = {}
  }

  init(userData: WidgetUserData) {
    const { widgetData } = this
    const { data, slot } = userData || {}

    widgetData.init(data)

    this.slotMap = slot || {}
  }

  async attach(tag: WidgetSlotTagEnum, materialId: number) {
    const { player, slotMap } = this

    slotMap[tag] = materialId

    await WidgetSlotChange.sendNotify(player.context, {
      op: WidgetSlotOpEnum.ATTACH,
      slot: this.exportSlot(tag),
    })
  }

  async detach(tag: WidgetSlotTagEnum) {
    const { player, slotMap } = this
    if (slotMap[tag] == null) return

    slotMap[tag] = null

    await WidgetSlotChange.sendNotify(player.context, {
      op: WidgetSlotOpEnum.DETACH,
      slot: this.exportSlot(tag),
    })
  }

  exportSlot(tag: WidgetSlotTagEnum): WidgetSlotData {
    const { slotMap } = this
    const slotData: WidgetSlotData = {
      tag,
      isActive: tag === WidgetSlotTagEnum.WIDGET_SLOT_QUICK_USE,
    }

    if (slotMap[tag] != null) {
      slotData.materialId = slotMap[tag]
      slotData.cdOverTime = 0
    }

    return slotData
  }

  exportSlotList(): WidgetSlotData[] {
    const { slotMap } = this

    return Object.keys(slotMap).map((k) => this.exportSlot(parseInt(k)))
  }

  exportAll(): AllWidgetDataNotify {
    const { widgetData } = this

    return {
      anchorPointList: [],
      nextAnchorPointUsableTime: 0,
      lunchBoxData: { slotMaterialMap: widgetData.lunchBox },
      oneoffGatherPointDetectorDataList: [],
      clientCollectorDataList: [],
      coolDownGroupDataList: [],
      normalCoolDownDataList: [],
      slotList: this.exportSlotList(),
    }
  }

  exportUserData(): WidgetUserData {
    const { widgetData, slotMap } = this

    return {
      data: widgetData.exportUserData(),
      slot: slotMap,
    }
  }
}
