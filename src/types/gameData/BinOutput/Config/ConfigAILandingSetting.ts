import ConfigAILandingData from "./ConfigAILandingData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAILandingSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAILandingSetting"
  DefaultSetting: ConfigAILandingData
  Specification: { [id: number]: ConfigAILandingData }
}
