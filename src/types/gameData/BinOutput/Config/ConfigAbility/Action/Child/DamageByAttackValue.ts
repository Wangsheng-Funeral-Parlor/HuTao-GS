import ConfigAttackInfo from '$DT/BinOutput/Config/ConfigAttackInfo'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface DamageByAttackValue extends ConfigBaseAbilityAction {
  $type: 'DamageByAttackValue'
  Attacker?: string
  Born?: ConfigBornType
  AttackInfo: ConfigAttackInfo
}