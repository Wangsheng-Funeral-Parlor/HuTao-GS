import { Action } from '.'

export default interface SetPoseInt extends Action {
  IntID: string
  Value: number
}