import { Action } from '.'

export default interface SetGlobalValue extends Action {
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}