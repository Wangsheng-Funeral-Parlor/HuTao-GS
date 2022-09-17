import ConfigAIExtractionData from './ConfigAIExtractionData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIExtractionSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIExtractionSetting'
  DefaultSetting: ConfigAIExtractionData
  Specification: { [id: number]: ConfigAIExtractionData }
}