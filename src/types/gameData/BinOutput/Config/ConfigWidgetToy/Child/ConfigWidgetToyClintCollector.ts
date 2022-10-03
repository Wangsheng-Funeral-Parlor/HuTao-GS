import ConfigBaseWidgetToy from '.'

export default interface ConfigWidgetToyClintCollector extends ConfigBaseWidgetToy {
  $type: 'ConfigWidgetToyClintCollector'
  TargetType: string | number
  ElementType: string | number
  RechargePoints: number
  MaxPoints: number
  EffectGadgetId: number
  UseGadgetId: number
  AllowOtherWorld: boolean
}