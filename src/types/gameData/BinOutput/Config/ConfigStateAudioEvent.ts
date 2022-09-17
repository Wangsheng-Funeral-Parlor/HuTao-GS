import ConfigWwiseString from './ConfigWwiseString'

export default interface ConfigStateAudioEvent {
  CurrentStateName: string
  AudioEvent: ConfigWwiseString
  OtherStateNames: string[]
  Usage: string
}