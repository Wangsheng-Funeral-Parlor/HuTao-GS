import ConfigBaseAbilityAction from '.'

export default interface SetCrystalShieldHpToOverrideMap extends ConfigBaseAbilityAction {
  $type: 'SetCrystalShieldHpToOverrideMap'
  OverrideMapKey: string
}