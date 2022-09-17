import ConfigAISpacialProbeData from './ConfigAISpacialProbeData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAISpacialProbeSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAISpacialProbeSetting'
  DefaultSetting: ConfigAISpacialProbeData
  Specification: { [id: number]: ConfigAISpacialProbeData }
}