import ConfigBaseAbilityAction from '.'

export default interface SetAnimatorBool extends ConfigBaseAbilityAction {
  $type: 'SetAnimatorBool'
  BoolID: string
  Value?: boolean
  Persistent?: boolean
}