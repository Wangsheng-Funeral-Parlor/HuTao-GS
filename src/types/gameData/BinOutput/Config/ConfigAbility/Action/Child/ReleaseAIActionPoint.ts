import ConfigBaseAbilityAction from '.'

export default interface ReleaseAIActionPoint extends ConfigBaseAbilityAction {
  $type: 'ReleaseAIActionPoint'
  PointType: string
}