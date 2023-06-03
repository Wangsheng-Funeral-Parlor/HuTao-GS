import { PersonalLineLockReasonEnum } from "./enum"

export interface LockedPersonallineData {
  chapterId?: number
  level?: number

  personalLineId?: number
  lockReason?: PersonalLineLockReasonEnum
}
