import ConfigBaseAbilityAction from '.'

export default interface SetRandomOverrideMapValue extends ConfigBaseAbilityAction {
  $type: 'SetRandomOverrideMapValue'
  ValueRangeMax: number
  ValueRangeMin: number
  OverrideMapKey: string
}