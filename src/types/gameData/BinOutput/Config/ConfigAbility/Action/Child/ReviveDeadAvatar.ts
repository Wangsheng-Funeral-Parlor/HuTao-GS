import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ReviveAvatar from './ReviveAvatar'

export default interface ReviveDeadAvatar extends Omit<ReviveAvatar, '$type'> {
  $type: 'ReviveDeadAvatar'
  IsReviveOtherPlayerAvatar: boolean
  SkillID: number
  CdRatio: DynamicFloat
  Range: number
}