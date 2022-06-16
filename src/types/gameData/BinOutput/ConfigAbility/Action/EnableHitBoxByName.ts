import { Action } from '.'

export default interface EnableHitBoxByName extends Action {
  HitBoxNames: string[]
  SetEnable?: boolean
}