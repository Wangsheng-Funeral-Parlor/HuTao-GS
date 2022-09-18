import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface HealSP extends ConfigBaseAbilityAction {
  $type: 'HealSP'
  Amount: DynamicFloat
  AmountByCasterMaxSPRatio: DynamicFloat
  AmountByTargetMaxSPRatio: DynamicFloat
  AmountByCurrentComboRatio: DynamicFloat
  MuteHealEffect: boolean
  HealRatio: number
}