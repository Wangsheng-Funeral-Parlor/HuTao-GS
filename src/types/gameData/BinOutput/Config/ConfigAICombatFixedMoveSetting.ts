import ConfigAICombatFixedMoveData from './ConfigAICombatFixedMoveData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAICombatFixedMoveSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAICombatFixedMoveSetting'
  DefaultSetting: ConfigAICombatFixedMoveData
  Specification: { [id: number]: ConfigAICombatFixedMoveData }
}