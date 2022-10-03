import ConfigBaseWidgetToy from '.'

export default interface ConfigWidgetToyClintDetector extends ConfigBaseWidgetToy {
  $type: 'ConfigWidgetToyClintDetector'
  GadgetId: number
  AllowCityId: number
  HintGroup: number
  DistanceToAvatar: number
  Height: number
}