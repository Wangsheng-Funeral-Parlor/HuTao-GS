import SelectTargetsByChildren from '$DT/BinOutput/Config/SelectTargets/Child/SelectTargetsByChildren'
import ConfigBaseAbilityAction from '.'

export default interface KillGadget extends ConfigBaseAbilityAction {
  $type: 'KillGadget'
  GadgetInfo: SelectTargetsByChildren
}