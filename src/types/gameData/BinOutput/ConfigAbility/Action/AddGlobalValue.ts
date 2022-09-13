import { Action } from '.'

export default interface AddGlobalValue extends Action {
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}