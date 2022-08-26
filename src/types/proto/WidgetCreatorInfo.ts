import { WidgetCreateLocationInfo } from '.'
import { WidgetCreatorOpTypeEnum } from './enum'

export interface WidgetCreatorInfo {
  opType: WidgetCreatorOpTypeEnum
  entityId: number
  locationInfo: WidgetCreateLocationInfo
}