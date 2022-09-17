import SelectTargetsByChildren from './Child/SelectTargetsByChildren'
import SelectTargetsByEquipParts from './Child/SelectTargetsByEquipParts'
import SelectTargetsByLCTrigger from './Child/SelectTargetsByLCTrigger'
import SelectTargetsByLCTriggerAll from './Child/SelectTargetsByLCTriggerAll'
import SelectTargetsBySelfGroup from './Child/SelectTargetsBySelfGroup'
import SelectTargetsByShape from './Child/SelectTargetsByShape'
import SelectTargetsByTag from './Child/SelectTargetsByTag'

type SelectTargets =
  SelectTargetsByChildren |
  SelectTargetsByEquipParts |
  SelectTargetsByLCTrigger |
  SelectTargetsByLCTriggerAll |
  SelectTargetsBySelfGroup |
  SelectTargetsByShape |
  SelectTargetsByTag

export default SelectTargets