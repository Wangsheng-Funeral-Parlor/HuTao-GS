import ConfigBaseAbilityAction from '.'

export default interface SetGlobalValueToOverrideMap extends ConfigBaseAbilityAction {
  $type: 'SetGlobalValueToOverrideMap'
  AbilityFormula?: string
  IsFromOwner?: boolean
  GlobalValueKey: string
  OverrideMapKey: string
}