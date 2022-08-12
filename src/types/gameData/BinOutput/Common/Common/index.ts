import EffectAttachShapeConfig from './EffectAttachShape'

export default interface CommonConfig {
  EffectAttachShape: EffectAttachShapeConfig
  Mass: number
  Height: number
  ModelHeight: number
  AffectedByWorld: boolean
  CheckInSurface: boolean
}