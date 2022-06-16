import { Point } from '.'

export default interface SceneTransPoint extends Point {
  Type?: string
  MaxSpringVolume?: number
  CutsceneList?: number[]
  NpcId?: number
  IsForbidAvatarRevive?: boolean
  IsForbidAvatarAutoUseSpring?: boolean
  MapVisibility?: string
}