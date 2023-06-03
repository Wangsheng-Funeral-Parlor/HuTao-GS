import { GrantReasonEnum } from "./enum"

export interface TrialAvatarGrantRecord {
  grantReason?: GrantReasonEnum
  fromParentQuestId?: number
}
