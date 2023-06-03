import ConfigAISpacialAdjustData from "./ConfigAISpacialAdjustData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAISpacialAdjustSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAISpacialAdjustSetting"
  DefaultSetting: ConfigAISpacialAdjustData
  Specification: { [id: number]: ConfigAISpacialAdjustData }
}
