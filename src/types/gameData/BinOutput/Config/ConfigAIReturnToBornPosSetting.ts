import ConfigAIReturnToBornPosData from "./ConfigAIReturnToBornPosData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIReturnToBornPosSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIReturnToBornPosSetting"
  DefaultSetting: ConfigAIReturnToBornPosData
  Specification: { [id: number]: ConfigAIReturnToBornPosData }
}
