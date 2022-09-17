import ConfigBaseAbilityMixin from '.'

export default interface SetSkillCanUseInStateMixin extends ConfigBaseAbilityMixin {
  $type: 'SetSkillCanUseInStateMixin'
  SkillList: number[]
  StateList: string[]
}