import ConfigBaseAbilityAction from '.'

export default interface SetAISkillCDMultiplier extends ConfigBaseAbilityAction {
  $type: 'SetAISkillCDMultiplier'
  Multiplier: number
}