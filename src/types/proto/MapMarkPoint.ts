import { VectorInfo } from '.'
import { MapMarkFromTypeEnum, MapMarkPointTypeEnum } from './enum'

export interface MapMarkPoint {
  sceneId: number
  name: string
  pos: VectorInfo
  pointType: MapMarkPointTypeEnum
  monsterId: number
  fromType: MapMarkFromTypeEnum
  questId: number
}