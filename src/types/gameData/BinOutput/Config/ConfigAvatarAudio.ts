import ConfigCombatSpeech from "./ConfigCombatSpeech"
import ConfigMoveStateAudio from "./ConfigMoveStateAudio"
import ConfigWwiseString from "./ConfigWwiseString"

export default interface ConfigAvatarAudio {
  MoveStateAudio: ConfigMoveStateAudio
  CombatSpeech: ConfigCombatSpeech
  VoiceSwitch: ConfigWwiseString
  BodyTypeSwitch: ConfigWwiseString
  ListenerLiftup: number
  SurfaceProberLiftup: number
}
