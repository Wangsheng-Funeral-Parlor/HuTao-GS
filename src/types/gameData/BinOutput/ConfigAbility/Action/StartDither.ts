import { Action } from '.'

export default interface StartDither extends Action {
  Duration: number
  Reverse?: boolean
}