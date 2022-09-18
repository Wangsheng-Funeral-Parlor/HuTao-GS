import ConfigBaseAbilityAction from '.'

export default interface TriggerSetCastShadow extends ConfigBaseAbilityAction {
  $type: 'TriggerSetCastShadow'
  CastShadow: boolean
}