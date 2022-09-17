import ConfigBaseAbilityMixin from '.'

export default interface TriggerWeatherMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerWeatherMixin'
  Type: string
  AreaId: number
  WeatherPattern: string
  TransDuration: number
  Duration: number
}