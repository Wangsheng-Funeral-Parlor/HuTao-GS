import { MapMarkFromTypeEnum, MapMarkPointTypeEnum } from '../enum/map'
import { VectorInterface } from './motion'

export interface MapAreaInfo {
  mapAreaId: number
  isOpen: boolean
}

export interface MapMarkPoint {
  sceneId: number
  name: string
  pos: VectorInterface
  pointType: MapMarkPointTypeEnum
  monsterId: number
  fromType: MapMarkFromTypeEnum
  questId: number
}