import ConfigAIPatrolFollowData from './ConfigAIPatrolFollowData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIPatrolFollowSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIPatrolFollowSetting'
  DefaultSetting: ConfigAIPatrolFollowData
  Specification: { [id: number]: ConfigAIPatrolFollowData }
}