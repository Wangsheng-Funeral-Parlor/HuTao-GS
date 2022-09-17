import ConfigBaseAbilityAction from '.'

export default interface SetGlobalValueByTargetDistance extends ConfigBaseAbilityAction {
  $type: 'SetGlobalValueByTargetDistance'
  Key: string
  IsXZ?: boolean
}