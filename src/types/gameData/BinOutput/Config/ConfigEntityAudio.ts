import ConfigAnimationAudio from "./ConfigAnimationAudio"
import ConfigWwiseString from "./ConfigWwiseString"

export default interface ConfigEntityAudio {
  AnimAudio: ConfigAnimationAudio
  InitEvent: ConfigWwiseString
  EnableEvent: ConfigWwiseString
  DisableEvent: ConfigWwiseString
  DestroyEvent: ConfigWwiseString
}
