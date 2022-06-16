import { Action } from '.'

export default interface SetGlobalValueByTargetDistance extends Action {
  Target: string
  Key: string
}