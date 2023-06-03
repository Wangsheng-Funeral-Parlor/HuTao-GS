import ConfigBaseSelectTargets from "."

export default interface SelectTargetsByEquipParts extends ConfigBaseSelectTargets {
  $type: "SelectTargetsByEquipParts"
  EquipPartNames: string[]
}
