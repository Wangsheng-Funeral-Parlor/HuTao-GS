import ConfigFluctuatedValue from "./ConfigFluctuatedValue"
import ConfigWwiseString from "./ConfigWwiseString"

export default interface ConfigAnimationRecurrentSpeech {
  Start: ConfigFluctuatedValue
  Interval: ConfigFluctuatedValue
  EventName: ConfigWwiseString
}
