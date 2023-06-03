import ConfigAIFleeData from "./ConfigAIFleeData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIFleeSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIFleeSetting"
  DefaultSetting: ConfigAIFleeData
  Specification: { [id: number]: ConfigAIFleeData }
}
