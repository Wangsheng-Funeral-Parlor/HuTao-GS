import { Action } from '.'

export default interface KillSelf extends Action {
  Duration?: number
  DieStateFlag?: string
  BanDrop?: boolean
  BanExp?: boolean
  BanHPPercentageDrop?: boolean
  KillSelfType: string
  HideEntity?: boolean
}