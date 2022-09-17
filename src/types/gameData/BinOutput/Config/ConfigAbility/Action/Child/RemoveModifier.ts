import ConfigBaseAbilityAction from '.'

export default interface RemoveModifier extends ConfigBaseAbilityAction {
  $type: 'RemoveModifier'
  ModifierName: string
}