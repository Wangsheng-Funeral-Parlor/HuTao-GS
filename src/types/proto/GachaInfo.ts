import { GachaUpInfo } from '.'

export interface GachaInfo {
  gachaType: number
  scheduleId?: number
  beginTime: number
  endTime: number
  costItemId: number
  costItemNum: number
  gachaPrefabPath: string
  gachaProbUrl: string
  gachaRecordUrl: string
  gachaPreviewPrefabPath: string
  tenCostItemId: number
  tenCostItemNum: number
  leftGachaTimes?: number
  gachaTimesLimit?: number
  gachaSortId: number
  gachaProbUrlOversea: string
  gachaRecordUrlOversea: string
  gachaUpInfoList?: GachaUpInfo[]
  titleTextmap?: string
  displayUp5ItemList?: number[]
  displayUp4ItemList?: number[]
  wishItemId?: number
  wishProgress?: number
  wishMaxProgress?: number
  isNewWish?: boolean
}