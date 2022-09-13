import { Action } from '.'

export default interface SetGlobalValueByTargetDistance extends Action {
  Key: string
  IsXZ?: boolean
}