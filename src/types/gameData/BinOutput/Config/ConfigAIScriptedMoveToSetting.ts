import ConfigAIScriptedMoveToData from "./ConfigAIScriptedMoveToData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIScriptedMoveToSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIScriptedMoveToSetting"
  DefaultSetting: ConfigAIScriptedMoveToData
  Specification: { [id: number]: ConfigAIScriptedMoveToData }
}
