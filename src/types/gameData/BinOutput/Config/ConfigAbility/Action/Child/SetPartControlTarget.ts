import ConfigBaseAbilityAction from '.'

export default interface SetPartControlTarget extends ConfigBaseAbilityAction {
  $type: 'SetPartControlTarget'
  PartRootNames: string[]
  TargetType: string
}