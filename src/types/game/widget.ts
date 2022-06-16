import { WidgetSlotTagEnum } from '@/types/enum/widget'
import { VectorInterface } from './motion'

export interface WidgetCoolDownData {
  id: number
  coolDownTime: string
  isSuccess?: boolean
}

export interface WidgetSlotData {
  tag: WidgetSlotTagEnum
  materialId?: number
  cdOverTime?: number
  isActive?: boolean
}

// Widget data

export interface AnchorPointData {
  anchorPointId: number
  pos: VectorInterface
  rot: VectorInterface
  endTime: number
}

export interface ClientCollectorData {
  materialId: number
  maxPoints: number
  currPoints: number
}

export interface LunchBoxData {
  slotMaterialMap: { [slot: number]: number }
}

export interface OneoffGatherPointDetectorData {
  materialId: number
  isAllCollected?: boolean
  isHintValid?: boolean
  hintCenterPos: VectorInterface
  hintRadius: number
  groupId: number
  configId: number
}