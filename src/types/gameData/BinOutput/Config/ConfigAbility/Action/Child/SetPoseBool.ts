import ConfigBaseAbilityAction from '.'

export default interface SetPoseBool extends ConfigBaseAbilityAction {
  $type: 'SetPoseBool'
  BoolID: string
  Value?: boolean
}