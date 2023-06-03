import ConfigGadgetTriggerAction from "../../ConfigGadgetTriggerAction"

import ConfigBaseGadgetPattern from "."

export default interface ConfigBulletPattern extends ConfigBaseGadgetPattern {
  $type: "ConfigBulletPattern"
  TriggerActions: ConfigGadgetTriggerAction[]
  TriggerLifeOverActions: ConfigGadgetTriggerAction[]
  KillByOther: boolean
  DieDelayTime: number
  CheckGrass: boolean
  CheckWater: boolean
  CheckInterval: number
  NeedCreateGW: boolean
  FireAISoundEvent: boolean
  MaxAutoKillDist: number
  EnableCollisionDelay: number
}
