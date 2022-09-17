import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'
import ConfigAIWanderData from './ConfigAIWanderData'

export default interface ConfigAIWanderSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIWanderSetting'
  ThreatLevelLimit: number[]
  DefaultSetting: ConfigAIWanderData
  Specification: { [id: number]: ConfigAIWanderData }
}