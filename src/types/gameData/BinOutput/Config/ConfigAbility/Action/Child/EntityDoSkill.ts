import ConfigBaseAbilityAction from '.'

export default interface EntityDoSkill extends ConfigBaseAbilityAction {
  $type: 'EntityDoSkill'
  SkillID: number
  IsHold: boolean
}