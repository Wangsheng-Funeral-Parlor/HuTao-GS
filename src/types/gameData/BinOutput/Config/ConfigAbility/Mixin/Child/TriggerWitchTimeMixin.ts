import ConfigBaseAbilityMixin from '.'

export default interface TriggerWitchTimeMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerWitchTimeMixin'
  IgnoreTargetType: string
  Timescale: number
  Duration: number
  UseMax: boolean
  EnableEffect: boolean
  EnableDelay: boolean
  DelayTimeScale: number
  DelayDuration: number
  OpenEffectPattern: string
  CloseEffectPattern: string
  WeatherPattern: string
}