import ConfigAttackEvent from '$DT/BinOutput/Config/ConfigAttackEvent'
import ConfigBaseAbilityAction from '.'

export default interface TriggerAttackEvent extends ConfigBaseAbilityAction {
  $type: 'TriggerAttackEvent'
  AttackEvent: ConfigAttackEvent
  TargetType: string
}