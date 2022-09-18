import ConfigBaseAbilityAction from '.'

export default interface AddAvatarSkillInfo extends ConfigBaseAbilityAction {
  $type: 'AddAvatarSkillInfo'
  SkillID: number
}