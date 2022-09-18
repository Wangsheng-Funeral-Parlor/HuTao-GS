import ConfigBaseAbilityAction from '.'

export default interface UnlockSkill extends ConfigBaseAbilityAction {
  $type: 'UnlockSkill'
  SkillID: number
}