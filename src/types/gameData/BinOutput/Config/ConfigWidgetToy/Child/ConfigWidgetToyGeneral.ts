import ConfigWidgetBehaviour from "../../ConfigWidgetBehaviour"

import ConfigBaseWidgetToy from "."

export default interface ConfigWidgetToyGeneral extends ConfigBaseWidgetToy {
  $type: "ConfigWidgetToyGeneral"
  DoBag: ConfigWidgetBehaviour
  DoActionPanel: ConfigWidgetBehaviour
}
