import ConfigStateAudioEvent from './ConfigStateAudioEvent'

export default interface ConfigMoveStateAudio {
  OnStateBegin: ConfigStateAudioEvent[]
  OnStateEnd: ConfigStateAudioEvent[]
}