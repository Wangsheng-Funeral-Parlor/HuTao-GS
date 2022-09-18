import ConfigBaseAbilityAction from '.'

export default interface RemoveUniqueModifier extends ConfigBaseAbilityAction {
  $type: 'RemoveUniqueModifier'
  ModifierName: string
}