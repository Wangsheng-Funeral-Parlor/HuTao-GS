import ConfigAICombatFollowMoveData from './ConfigAICombatFollowMoveData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAICombatFollowMoveSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAICombatFollowMoveSetting'
  DefaultSetting: ConfigAICombatFollowMoveData
  Specification: { [id: number]: ConfigAICombatFollowMoveData }
}