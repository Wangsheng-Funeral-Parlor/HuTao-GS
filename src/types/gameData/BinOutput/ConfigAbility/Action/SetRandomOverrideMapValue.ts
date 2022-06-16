import { Action } from '.'

export default interface SetRandomOverrideMapValue extends Action {
  ValueRangeMax: number
  ValueRangeMin: number
  OverrideMapKey: string
}