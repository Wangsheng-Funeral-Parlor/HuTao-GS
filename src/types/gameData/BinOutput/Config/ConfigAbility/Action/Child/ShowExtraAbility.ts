import ConfigBaseAbilityAction from '.'

export default interface ShowExtraAbility extends ConfigBaseAbilityAction {
  $type: 'ShowExtraAbility'
  SkillID: number
}