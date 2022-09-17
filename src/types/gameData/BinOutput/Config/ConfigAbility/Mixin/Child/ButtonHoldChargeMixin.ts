import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface ButtonHoldChargeMixin extends ConfigBaseAbilityMixin {
  $type: 'ButtonHoldChargeMixin'
  SkillID: number
  ChargeTime: number
  SecondChargeTime: DynamicFloat
  OnBeginUncharged: ConfigAbilityAction[]
  OnReleaseUncharged: ConfigAbilityAction[]
  OnBeginCharged: ConfigAbilityAction[]
  OnReleaseCharged: ConfigAbilityAction[]
  OnBeginSecondCharged: ConfigAbilityAction[]
  OnReleaseSecondCharged: ConfigAbilityAction[]
  ChargeStateIDs: string[]
}