import { GachaTransferItem, ItemParam } from "."

export interface GachaItem {
  gachaItem: ItemParam
  transferItems?: GachaTransferItem[]
  isFlashCard: boolean
  isGachaItemNew: boolean
  tokenItemList: ItemParam[]
}
