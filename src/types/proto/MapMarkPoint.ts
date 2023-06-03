import { MapMarkFromTypeEnum, MapMarkPointTypeEnum } from "./enum"

import { VectorInfo } from "."

export interface MapMarkPoint {
  sceneId: number
  name: string
  pos: VectorInfo
  pointType: MapMarkPointTypeEnum
  monsterId: number
  fromType: MapMarkFromTypeEnum
  questId: number
}
