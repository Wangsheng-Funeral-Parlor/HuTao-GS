import { Action } from '.'
import Vector from '../../Common/Vector'

export default interface DungeonFogEffects extends Action {
  Enable?: boolean
  CameraFogEffectName: string
  PlayerFogEffectName: string
  LocalOffset?: Vector
}