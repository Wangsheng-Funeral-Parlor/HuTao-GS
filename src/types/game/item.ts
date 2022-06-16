import { ReliquaryInterface } from './reliquary'
import { WeaponInterface } from './weapon'

export interface CountDownDelete {
  deleteTimeNumMap: { [id: number]: number }
  configCountDownTime: number
}

export interface DateTimeDelete {
  deleteTime: number
}

export interface DelayWeekCountDownDelete {
  deleteTimeNumMap: { [id: number]: number }
  configDelayWeek: number
  configCountDownTime: number
}

export interface MaterialDeleteInfo {
  countDownDelete?: CountDownDelete
  dateDelete?: DateTimeDelete
  delayWeekCountDownDelete?: DelayWeekCountDownDelete
  hasDeleteConfig: boolean
}

export interface MaterialInterface {
  count: number
  deleteInfo?: MaterialDeleteInfo
}

export interface EquipInterface {
  reliquary?: ReliquaryInterface
  weapon?: WeaponInterface
  isLocked: boolean
}

export interface FurnitureInterface {
  count: number
}

export interface ItemInterface {
  material?: MaterialInterface
  equip?: EquipInterface
  furniture?: FurnitureInterface

  itemId: number
  guid: string
}

export interface ItemParam {
  itemId: number
  count: number
}