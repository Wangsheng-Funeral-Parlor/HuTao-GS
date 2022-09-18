import ConfigBaseAbilityAction from '.'

export default interface SetEmissionScaler extends ConfigBaseAbilityAction {
  $type: 'SetEmissionScaler'
  MaterialType: string
  UseDefaultColor: boolean
  Value: number
  Duration: number
}