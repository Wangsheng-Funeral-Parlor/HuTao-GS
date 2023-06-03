import ConfigAIMixinSetAnimatorTrigger from "./ConfigAIMixinSetAnimatorTrigger"
import ConfigAIMixinSetBool from "./ConfigAIMixinSetBool"
import ConfigAIMixinSetFloat from "./ConfigAIMixinSetFloat"
import ConfigAIMixinSetInt from "./ConfigAIMixinSetInt"

export default interface ConfigAIMixinActions {
  SetPoseBool: ConfigAIMixinSetBool[]
  SetPoseInt: ConfigAIMixinSetInt[]
  SetPoseFloat: ConfigAIMixinSetFloat[]
  SetAnimatorTrigger: ConfigAIMixinSetAnimatorTrigger[]
  SetAnimatorBool: ConfigAIMixinSetBool[]
  SetAnimatorInt: ConfigAIMixinSetInt[]
  SetAnimatorFloat: ConfigAIMixinSetFloat[]
}
