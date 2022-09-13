import SelectTargetsByChildren from "./SelectTargetsByChildren"
import SelectTargetsByEquipParts from "./SelectTargetsByEquipParts"
import SelectTargetsByLCTrigger from "./SelectTargetsByLCTrigger"
import SelectTargetsByLCTriggerAll from "./SelectTargetsByLCTriggerAll"
import SelectTargetsBySelfGroup from "./SelectTargetsBySelfGroup"
import SelectTargetsByShape from "./SelectTargetsByShape"
import SelectTargetsByTag from "./SelectTargetsByTag"

export interface SelectTargets {
  $type: string
  Target?: string
}

type SelectTargetsConfig =
  SelectTargetsByChildren |
  SelectTargetsByEquipParts |
  SelectTargetsByLCTrigger |
  SelectTargetsByLCTriggerAll |
  SelectTargetsBySelfGroup |
  SelectTargetsByShape |
  SelectTargetsByTag

export default SelectTargetsConfig