import ConfigBaseAbilityMixin from '.'

export default interface AvatarLevelSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarLevelSkillMixin'
  SkillID: number
  SkillIndex: number
}