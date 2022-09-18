import ConfigBaseAbilityAction from '.'

export default interface RegisterAIActionPoint extends ConfigBaseAbilityAction {
  $type: 'RegisterAIActionPoint'
  PointType: string
}