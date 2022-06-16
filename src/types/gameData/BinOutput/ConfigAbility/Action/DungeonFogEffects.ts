import { Action } from '.'

export default interface DungeonFogEffects extends Action {
  MuteRemoteAction?: boolean
  Enable?: boolean
  CameraFogEffectName: string
  PlayerFogEffectName: string
}