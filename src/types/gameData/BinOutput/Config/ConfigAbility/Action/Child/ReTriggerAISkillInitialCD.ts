import ConfigBaseAbilityAction from '.'

export default interface ReTriggerAISkillInitialCD extends ConfigBaseAbilityAction {
  $type: 'ReTriggerAISkillInitialCD'
  SkillIDs: number[]
}