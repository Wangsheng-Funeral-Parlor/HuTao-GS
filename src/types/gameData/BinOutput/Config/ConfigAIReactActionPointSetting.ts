import ConfigAIReactActionPointData from './ConfigAIReactActionPointData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIReactActionPointSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIReactActionPointSetting'
  DefaultSetting: ConfigAIReactActionPointData
  Specification: { [id: number]: ConfigAIReactActionPointData }
}