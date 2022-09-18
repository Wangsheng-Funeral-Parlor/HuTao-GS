import ConfigBaseAbilityAction from '.'

export default interface SetVelocityIgnoreAirGY extends ConfigBaseAbilityAction {
  $type: 'SetVelocityIgnoreAirGY'
  IgnoreAirGY: boolean
}