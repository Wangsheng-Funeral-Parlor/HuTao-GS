import ConfigGadgetDamageByAttackValue from "./Child/ConfigGadgetDamageByAttackValue"
import ConfigGadgetDoAttackEvent from "./Child/ConfigGadgetDoAttackEvent"
import ConfigGadgetTriggerAbility from "./Child/ConfigGadgetTriggerAbility"

type ConfigGadgetTriggerAction =
  | ConfigGadgetDamageByAttackValue
  | ConfigGadgetDoAttackEvent
  | ConfigGadgetTriggerAbility

export default ConfigGadgetTriggerAction
