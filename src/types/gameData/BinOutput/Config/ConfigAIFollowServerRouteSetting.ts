import ConfigAIFollowServerRouteData from "./ConfigAIFollowServerRouteData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIFollowServerRouteSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIFollowServerRouteSetting"
  DefaultSetting: ConfigAIFollowServerRouteData
  Specification: { [id: number]: ConfigAIFollowServerRouteData }
}
