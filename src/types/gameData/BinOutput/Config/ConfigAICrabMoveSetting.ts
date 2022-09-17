import ConfigAICrabMoveData from './ConfigAICrabMoveData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAICrabMoveSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAICrabMoveSetting'
  DefaultSetting: ConfigAICrabMoveData
  Specification: { [id: number]: ConfigAICrabMoveData }
}