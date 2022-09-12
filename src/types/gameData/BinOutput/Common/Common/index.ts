import EffectAttachShapeConfig from './EffectAttachShape'

export default interface CommonConfig {
  EffectAttachShape: EffectAttachShapeConfig
  Mass: number
  Height: number
  ModelHeight: number
  viewSize: number
  AffectedByWorld: boolean
  CheckInSurface: boolean
  CanTriggerElementReactionText: boolean
  UseGrassDisplacement: boolean
}