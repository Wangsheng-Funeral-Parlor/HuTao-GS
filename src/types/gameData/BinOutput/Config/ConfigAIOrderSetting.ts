import ConfigAICommandSetting from './ConfigAICommandSetting'
import ConfigAIOrderMasterSetting from './ConfigAIOrderMasterSetting'
import ConfigAIOrderServantSetting from './ConfigAIOrderServantSetting'

export default interface ConfigAIOrderSetting {
  Master: ConfigAIOrderMasterSetting
  Servant: ConfigAIOrderServantSetting
  CommandSetting: ConfigAICommandSetting
}