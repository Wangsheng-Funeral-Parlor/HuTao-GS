import ConfigBaseAbilityAction from '.'

export default interface DoWidgetSystemAction extends ConfigBaseAbilityAction {
  $type: 'DoWidgetSystemAction'
  WidgetEvent: string
}