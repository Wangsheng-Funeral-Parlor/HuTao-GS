import ConfigBaseAbilityAction from '.'

export default interface SetSystemValueToOverrideMap extends ConfigBaseAbilityAction {
  $type: 'SetSystemValueToOverrideMap'
  Key: string
  Type: string
}