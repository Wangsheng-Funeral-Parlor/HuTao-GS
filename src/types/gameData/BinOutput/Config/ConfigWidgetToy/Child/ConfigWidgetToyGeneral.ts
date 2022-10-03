import ConfigBaseWidgetToy from '.'
import ConfigWidgetBehaviour from '../../ConfigWidgetBehaviour'

export default interface ConfigWidgetToyGeneral extends ConfigBaseWidgetToy {
  $type: 'ConfigWidgetToyGeneral'
  DoBag: ConfigWidgetBehaviour
  DoActionPanel: ConfigWidgetBehaviour
}