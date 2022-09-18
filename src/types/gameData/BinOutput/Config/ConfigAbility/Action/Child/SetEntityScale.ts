import ConfigBaseAbilityAction from '.'

export default interface SetEntityScale extends ConfigBaseAbilityAction {
  $type: 'SetEntityScale'
  Scale: number
}