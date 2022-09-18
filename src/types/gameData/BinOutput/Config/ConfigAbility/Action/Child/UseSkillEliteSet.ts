import ConfigBaseAbilityAction from '.'

export default interface UseSkillEliteSet extends ConfigBaseAbilityAction {
  $type: 'UseSkillEliteSet'
  SkillEliteSetID: number
}