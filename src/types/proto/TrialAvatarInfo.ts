import { ItemInfo, TrialAvatarGrantRecord } from "."

export interface TrialAvatarInfo {
  trialAvatarId?: number
  trialEquipList?: ItemInfo[]
  grantRecord?: TrialAvatarGrantRecord
}
