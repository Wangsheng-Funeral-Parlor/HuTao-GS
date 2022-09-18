import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface TriggerAbility extends ConfigBaseAbilityAction {
  $type: 'TriggerAbility'
  AbilityName: string
  AbilitySpecials: { [key: string]: DynamicFloat }
  ForceUseSelfCurrentAttackTarget: boolean
}