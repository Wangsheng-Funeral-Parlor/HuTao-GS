import { Action } from '.'

export default interface SetAnimatorBool extends Action {
  BoolID: string
  Value?: boolean
  Persistent?: boolean
}