import ConfigAIFollowScriptedPathData from './ConfigAIFollowScriptedPathData'
import ConfigAITacticBaseSetting from './ConfigAITacticBaseSetting'

export default interface ConfigAIFollowScriptedPathSetting extends ConfigAITacticBaseSetting {
  $type: 'ConfigAIFollowScriptedPathSetting'
  DefaultSetting: ConfigAIFollowScriptedPathData
  Specification: { [id: number]: ConfigAIFollowScriptedPathData }
}