import ConfigBaseWidgetToy from "../.."

export default interface ConfigBaseWidgetToyCreateGadget extends ConfigBaseWidgetToy {
  GadgetId: number
  IsSeverGadget: boolean
  IsSeverGadgetCoverCreate: boolean
  IsSetCamera: boolean
  SetCameraAngle: number
}
