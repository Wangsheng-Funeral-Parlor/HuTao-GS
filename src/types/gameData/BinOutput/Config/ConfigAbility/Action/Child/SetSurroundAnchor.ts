import ConfigBaseAbilityAction from '.'

export default interface SetSurroundAnchor extends ConfigBaseAbilityAction {
  $type: 'SetSurroundAnchor'
  SetPoint: boolean
  ActionPointType: string
  ActionPointID: number
}