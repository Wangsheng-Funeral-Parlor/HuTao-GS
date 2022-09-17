import ConfigBaseAbilityMixin from '.'

export default interface SwitchSkillIDMixin extends ConfigBaseAbilityMixin {
  $type: 'SwitchSkillIDMixin'
  Priority: string
  SkillIndex: number
  SkillID: number
  FromSkillID: number
  ToSkillID: number
}