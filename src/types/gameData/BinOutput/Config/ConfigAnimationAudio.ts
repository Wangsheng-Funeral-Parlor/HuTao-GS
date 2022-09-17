import ConfigAnimationRecurrentSpeech from './ConfigAnimationRecurrentSpeech'
import ConfigStateAudioEvent from './ConfigStateAudioEvent'

export default interface ConfigAnimationAudio {
  OnTransitionIn: ConfigStateAudioEvent[]
  OnTransitionOut: ConfigStateAudioEvent[]
  RecurrentSpeeches: { [key: string]: ConfigAnimationRecurrentSpeech }
}