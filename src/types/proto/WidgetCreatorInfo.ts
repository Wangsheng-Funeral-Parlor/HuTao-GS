import { WidgetCreatorOpTypeEnum } from "./enum"

import { WidgetCreateLocationInfo } from "."

export interface WidgetCreatorInfo {
  opType: WidgetCreatorOpTypeEnum
  entityId: number
  locationInfo: WidgetCreateLocationInfo
}
