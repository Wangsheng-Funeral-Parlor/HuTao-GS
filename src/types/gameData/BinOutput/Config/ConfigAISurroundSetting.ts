import ConfigAISurroundData from "./ConfigAISurroundData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAISurroundSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAISurroundSetting"
  DefaultSetting: ConfigAISurroundData
  Specification: { [id: number]: ConfigAISurroundData }
}
