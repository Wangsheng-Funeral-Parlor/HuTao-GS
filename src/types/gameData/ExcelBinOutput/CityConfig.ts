export interface CityConfig {
  CityId: number
  SceneId: number
  AreaIdVec: number[]
  CityNameTextMapHash: number
  MapPosX: number
  MapPosY: number
  ZoomForExploration: number
  AdventurePointId: number
  ExpeditionMap: string
  ExpeditionWaterMark: string
  OpenState: string
  CityGoddnessNameTextMapHash: number
  CityGoddnessDescTextMapHash: number
}

type CityConfigList = CityConfig[]

export default CityConfigList