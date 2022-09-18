import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface SetSkillAnchor extends ConfigBaseAbilityAction {
  $type: 'SetSkillAnchor'
  Born: ConfigBornType
}