import ConfigBaseAbilityPredicate from '.'

export default interface BySkillReady extends ConfigBaseAbilityPredicate {
  $type: 'BySkillReady'
  SkillID: number
  SkillSlot: number[]
}