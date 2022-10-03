import ConfigWidgetCdGroup from './ConfigWidgetCdGroup'
import ConfigWidgetGadget from './ConfigWidgetGadget'
import ConfigWidgetToy from './ConfigWidgetToy'

export default interface ConfigMainWidgetToy {
  GadgetConfigMap: { [id: number]: ConfigWidgetGadget }
  CdGroupConfigMap: { [id: number]: ConfigWidgetCdGroup }
  WidgetConfigMap: { [id: number]: ConfigWidgetToy }
}