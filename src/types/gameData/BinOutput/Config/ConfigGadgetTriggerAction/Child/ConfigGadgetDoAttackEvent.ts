import ConfigBaseGadgetTriggerAction from "."

export default interface ConfigGadgetDoAttackEvent extends ConfigBaseGadgetTriggerAction {
  $type: "ConfigGadgetDoAttackEvent"
  AttackEvent: string
}
