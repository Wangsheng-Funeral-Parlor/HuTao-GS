import ConfigWwiseString from './ConfigWwiseString'
import ConfigCombatSpeech from './ConfigCombatSpeech'
import ConfigMoveStateAudio from './ConfigMoveStateAudio'

export default interface ConfigAvatarAudio {
  MoveStateAudio: ConfigMoveStateAudio
  CombatSpeech: ConfigCombatSpeech
  VoiceSwitch: ConfigWwiseString
  BodyTypeSwitch: ConfigWwiseString
  ListenerLiftup: number
  SurfaceProberLiftup: number
}