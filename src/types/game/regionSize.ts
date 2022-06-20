export interface CylinderRegionSize {
  radius: number
  height: number
}

export interface PolygonRegionSize {
  pointList: VectorPlane[]
  height: number
}

export interface VectorPlane {
  X: number
  Y: number
}