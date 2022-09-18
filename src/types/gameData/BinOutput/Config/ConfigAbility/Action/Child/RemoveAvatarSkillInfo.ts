import ConfigBaseAbilityAction from '.'

export default interface RemoveAvatarSkillInfo extends ConfigBaseAbilityAction {
  $type: 'RemoveAvatarSkillInfo'
  SkillID: number
}