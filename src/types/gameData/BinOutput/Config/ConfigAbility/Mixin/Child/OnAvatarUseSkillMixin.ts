import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface OnAvatarUseSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'OnAvatarUseSkillMixin'
  OnTriggerNormalAttack: ConfigAbilityAction[]
  OnTriggerSkill: ConfigAbilityAction[]
  OnTriggerUltimateSkill: ConfigAbilityAction[]
}