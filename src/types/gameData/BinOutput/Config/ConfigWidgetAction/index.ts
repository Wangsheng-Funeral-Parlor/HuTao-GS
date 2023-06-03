import AddAbilityGroup from "./AddAbilityGroup"
import AddDynamicValue from "./AddDynamicValue"
import CreateLocalGadget from "./CreateLocalGadget"
import CreateSeverGadget from "./CreateSeverGadget"
import PrintDebug from "./PrintDebug"
import RemoveDynamicValue from "./RemoveDynamicValue"
import TakePhoto from "./TakePhoto"

type ConfigWidgetAction =
  | AddAbilityGroup
  | AddDynamicValue
  | CreateLocalGadget
  | CreateSeverGadget
  | PrintDebug
  | RemoveDynamicValue
  | TakePhoto

export default ConfigWidgetAction
