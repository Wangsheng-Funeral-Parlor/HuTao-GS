import ConfigCustomAttackShape from "./ConfigCustomAttackShape"
import ConfigDither from "./ConfigDither"
import ConfigEntityCommon from "./ConfigEntityCommon"
import ConfigEntityPoint from "./ConfigEntityPoint"
import ConfigEntityTags from "./ConfigEntityTags"
import ConfigGlobalValue from "./ConfigGlobalValue"
import ConfigHeadControl from "./ConfigHeadControl"
import ConfigModel from "./ConfigModel"

export default interface ConfigEntity {
  Common: ConfigEntityCommon
  HeadControl: ConfigHeadControl
  SpecialPoint: ConfigEntityPoint
  CustomAttackShape: ConfigCustomAttackShape
  Model: ConfigModel
  Dither: ConfigDither
  GlobalValue: ConfigGlobalValue
  EntityTags: ConfigEntityTags
}
