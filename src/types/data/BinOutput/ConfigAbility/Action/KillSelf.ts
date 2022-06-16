import { Action } from '.'

export default interface KillSelf extends Action {
  BanDrop: boolean
  BanExp: boolean
  KillSelfType: string
}