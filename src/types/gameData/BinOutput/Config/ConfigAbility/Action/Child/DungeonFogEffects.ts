import ConfigBaseAbilityAction from '.'
import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'

export default interface DungeonFogEffects extends ConfigBaseAbilityAction {
  $type: 'DungeonFogEffects'
  Enable?: boolean
  CameraFogEffectName: string
  PlayerFogEffectName: string
  LocalOffset?: DynamicVector
}