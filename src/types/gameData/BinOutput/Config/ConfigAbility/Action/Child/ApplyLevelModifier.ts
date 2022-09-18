import ConfigBaseAbilityAction from '.'

export default interface ApplyLevelModifier extends ConfigBaseAbilityAction {
  $type: 'ApplyLevelModifier'
  ModifierName: string
}