import ConfigBornByActionPoint from "./Child/ConfigBornByActionPoint"
import ConfigBornByAttachPoint from "./Child/ConfigBornByAttachPoint"
import ConfigBornByCollisionPoint from "./Child/ConfigBornByCollisionPoint"
import ConfigBornByElementPos from "./Child/ConfigBornByElementPos"
import ConfigBornByGlobalValue from "./Child/ConfigBornByGlobalValue"
import ConfigBornByHitPoint from "./Child/ConfigBornByHitPoint"
import ConfigBornByPredicatePoint from "./Child/ConfigBornByPredicatePoint"
import ConfigBornByRushToPoint from "./Child/ConfigBornByRushToPoint"
import ConfigBornBySelf from "./Child/ConfigBornBySelf"
import ConfigBornBySelfOwner from "./Child/ConfigBornBySelfOwner"
import ConfigBornByStormLightning from "./Child/ConfigBornByStormLightning"
import ConfigBornByTarget from "./Child/ConfigBornByTarget"
import ConfigBornByTargetLinearPoint from "./Child/ConfigBornByTargetLinearPoint"
import ConfigBornByTeleportToPoint from "./Child/ConfigBornByTeleportToPoint"
import ConfigBornByWorld from "./Child/ConfigBornByWorld"

type ConfigBornType =
  | ConfigBornByActionPoint
  | ConfigBornByAttachPoint
  | ConfigBornByCollisionPoint
  | ConfigBornByElementPos
  | ConfigBornByGlobalValue
  | ConfigBornByHitPoint
  | ConfigBornByPredicatePoint
  | ConfigBornByRushToPoint
  | ConfigBornBySelf
  | ConfigBornBySelfOwner
  | ConfigBornByStormLightning
  | ConfigBornByTarget
  | ConfigBornByTargetLinearPoint
  | ConfigBornByTeleportToPoint
  | ConfigBornByWorld

export default ConfigBornType
