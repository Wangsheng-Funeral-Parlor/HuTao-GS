import { WidgetSlotTagEnum } from "./enum"

export interface WidgetSlotData {
  tag: WidgetSlotTagEnum
  materialId?: number
  cdOverTime?: number
  isActive?: boolean
}
