import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface TriggerThrowEquipPart extends ConfigBaseAbilityAction {
  $type: 'TriggerThrowEquipPart'
  EquipPart: string
  ChaseAttackTarget: boolean
  Born: ConfigBornType
}