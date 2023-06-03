import ConfigBaseWidgetToy from "."

export default interface ConfigWidgetToyGadgetBuilder extends ConfigBaseWidgetToy {
  $type: "ConfigWidgetToyGadgetBuilder"
  LastingTime: number
  GadgetId: number
  DistanceToAvatar: number
  HeightToAvatar: number
  Radius: number
  CheckCollision: boolean
}
