import ConfigAISpacialChaseData from './ConfigAISpacialChaseData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAISpacialChaseSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAISpacialChaseSetting'
  DefaultSetting: ConfigAISpacialChaseData
  Specification: { [id: number]: ConfigAISpacialChaseData }
}