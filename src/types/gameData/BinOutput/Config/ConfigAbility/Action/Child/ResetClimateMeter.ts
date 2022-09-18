import ConfigBaseAbilityAction from '.'

export default interface ResetClimateMeter extends ConfigBaseAbilityAction {
  $type: 'ResetClimateMeter'
  ClimateType: string
}