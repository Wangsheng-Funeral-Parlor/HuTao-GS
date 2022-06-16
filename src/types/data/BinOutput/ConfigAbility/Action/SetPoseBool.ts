import { Action } from '.'

export default interface SetPoseBool extends Action {
  BoolID: string
  Value?: boolean
}