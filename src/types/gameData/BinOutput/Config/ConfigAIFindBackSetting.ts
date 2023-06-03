import ConfigAIFindBackData from "./ConfigAIFindBackData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIFindBackSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIFindBackSetting"
  DefaultSetting: ConfigAIFindBackData
  Specification: { [id: number]: ConfigAIFindBackData }
}
