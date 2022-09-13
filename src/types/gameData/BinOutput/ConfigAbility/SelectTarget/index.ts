import SelectTargetByChildren from "./SelectTargetsByChildren"
import SelectTargetByEquipParts from "./SelectTargetsByEquipParts"
import SelectTargetByLCTrigger from "./SelectTargetsByLCTrigger"
import SelectTargetByLCTriggerAll from "./SelectTargetsByLCTriggerAll"
import SelectTargetBySelfGroup from "./SelectTargetsBySelfGroup"
import SelectTargetByShape from "./SelectTargetsByShape"
import SelectTargetByTag from "./SelectTargetsByTag"

export interface SelectTarget {
  $type: string
  Target?: string
}

type SelectTargetConfig =
  SelectTargetByChildren |
  SelectTargetByEquipParts |
  SelectTargetByLCTrigger |
  SelectTargetByLCTriggerAll |
  SelectTargetBySelfGroup |
  SelectTargetByShape |
  SelectTargetByTag

export default SelectTargetConfig