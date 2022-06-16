import { PersonalLineLockReasonEnum } from '../enum/quest'

export interface LockedPersonallineData {
  chapterId: number
  level: number

  personalLineId: number
  lockReason: PersonalLineLockReasonEnum
}