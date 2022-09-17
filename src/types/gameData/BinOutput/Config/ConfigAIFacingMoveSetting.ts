import ConfigAIFacingMoveData from './ConfigAIFacingMoveData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIFacingMoveSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIFacingMoveSetting'
  DefaultSetting: ConfigAIFacingMoveData
  Specification: { [id: number]: ConfigAIFacingMoveData }
}