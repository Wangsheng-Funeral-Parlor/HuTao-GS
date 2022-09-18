import ConfigBaseAbilityAction from '.'

export default interface ChangeEnviroWeather extends ConfigBaseAbilityAction {
  $type: 'ChangeEnviroWeather'
  AreaId: number
  ClimateType: number
  TransDuration: number
}