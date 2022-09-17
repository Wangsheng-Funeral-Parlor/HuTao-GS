import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface IceFloorMixin extends ConfigBaseAbilityMixin {
  $type: 'IceFloorMixin'
  Width: number
  Height: number
  MoveDistance: number
  MinInterval: number
  DoAction: ConfigAbilityAction
}