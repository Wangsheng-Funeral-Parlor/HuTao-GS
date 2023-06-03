import ConfigBaseWidgetToy from "."

export default interface ConfigWidgetToyBonfire extends ConfigBaseWidgetToy {
  $type: "ConfigWidgetToyBonfire"
  GadgetId: number
  DistanceToAvatar: number
  Radius: number
}
