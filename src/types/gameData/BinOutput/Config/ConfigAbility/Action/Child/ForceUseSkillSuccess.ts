import ConfigBaseAbilityAction from '.'

export default interface ForceUseSkillSuccess extends ConfigBaseAbilityAction {
  $type: 'ForceUseSkillSuccess'
  SkillID: number
  Type: string
  Immediately: boolean
}