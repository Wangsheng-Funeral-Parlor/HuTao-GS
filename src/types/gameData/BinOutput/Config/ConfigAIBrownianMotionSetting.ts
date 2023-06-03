import ConfigAIBrownianMotionData from "./ConfigAIBrownianMotionData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIBrownianMotionSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIBrownianMotionSetting"
  DefaultSetting: ConfigAIBrownianMotionData
  Specification: { [id: number]: ConfigAIBrownianMotionData }
}
