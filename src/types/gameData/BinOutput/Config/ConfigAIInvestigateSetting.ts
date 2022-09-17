import ConfigAIInvestigateData from './ConfigAIInvestigateData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIInvestigateSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIInvestigateSetting'
  DefaultSetting: ConfigAIInvestigateData
  Specification: { [id: number]: ConfigAIInvestigateData }
}