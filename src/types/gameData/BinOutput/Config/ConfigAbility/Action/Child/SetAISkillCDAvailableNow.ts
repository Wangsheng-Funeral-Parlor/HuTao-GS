import ConfigBaseAbilityAction from '.'

export default interface SetAISkillCDAvailableNow extends ConfigBaseAbilityAction {
  $type: 'SetAISkillCDAvailableNow'
  SkillIDs: number[]
}