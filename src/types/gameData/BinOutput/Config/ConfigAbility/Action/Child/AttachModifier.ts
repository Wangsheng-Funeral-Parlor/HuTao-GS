import ConfigBaseAbilityAction from '.'

export default interface AttachModifier extends ConfigBaseAbilityAction {
  $type: 'AttachModifier'
  ModifierName: string
}