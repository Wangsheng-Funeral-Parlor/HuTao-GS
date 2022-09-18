import ConfigAttackTargetMapEvent from '$DT/BinOutput/Config/ConfigAttackTargetMapEvent'
import ConfigBaseAbilityAction from '.'

export default interface TriggerAttackTargetMapEvent extends ConfigBaseAbilityAction {
  $type: 'TriggerAttackTargetMapEvent'
  AttackTargetMapEvent: ConfigAttackTargetMapEvent
}