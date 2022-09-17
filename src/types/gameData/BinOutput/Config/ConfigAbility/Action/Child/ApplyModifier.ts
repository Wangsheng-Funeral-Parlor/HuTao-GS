import ConfigBaseAbilityAction from '.'

export default interface ApplyModifier extends ConfigBaseAbilityAction {
  $type: 'ApplyModifier'
  ModifierName: string
}