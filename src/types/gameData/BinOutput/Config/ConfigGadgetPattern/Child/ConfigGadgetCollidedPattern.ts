import ConfigGadgetTriggerAction from "../../ConfigGadgetTriggerAction"

import ConfigBaseGadgetPattern from "."

export default interface ConfigGadgetCollidedPattern extends ConfigBaseGadgetPattern {
  $type: "ConfigGadgetCollidedPattern"
  CollisionActions: ConfigGadgetTriggerAction[]
  ThisColliderName: string
  TargetColliderName: string
}
