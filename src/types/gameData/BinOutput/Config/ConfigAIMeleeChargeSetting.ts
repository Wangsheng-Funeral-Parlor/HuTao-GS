import ConfigAIMeleeChargeData from "./ConfigAIMeleeChargeData"
import ConfigAITacticBaseSetting from "./ConfigAITacticBaseSetting"

export default interface ConfigAIMeleeChargeSetting extends ConfigAITacticBaseSetting {
  $type: "ConfigAIMeleeChargeSetting"
  DefaultSetting: ConfigAIMeleeChargeData
  Specification: { [id: number]: ConfigAIMeleeChargeData }
}
