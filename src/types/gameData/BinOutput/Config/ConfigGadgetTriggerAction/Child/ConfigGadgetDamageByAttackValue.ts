import ConfigAttackInfo from "../../ConfigAttackInfo"
import ConfigBornType from "../../ConfigBornType"

import ConfigBaseGadgetTriggerAction from "."

export default interface ConfigGadgetDamageByAttackValue extends ConfigBaseGadgetTriggerAction {
  $type: "ConfigGadgetDamageByAttackValue"
  Born: ConfigBornType
  AttackInfo: ConfigAttackInfo
}
