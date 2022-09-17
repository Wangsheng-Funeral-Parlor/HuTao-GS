import ConfigAIBirdCirclingData from './ConfigAIBirdCirclingData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIBirdCirclingSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIBirdCirclingSetting'
  DefaultSetting: ConfigAIBirdCirclingData
  Specification: { [id: number]: ConfigAIBirdCirclingData }
}