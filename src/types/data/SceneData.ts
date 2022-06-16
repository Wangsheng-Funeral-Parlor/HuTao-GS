import Vector from './BinOutput/Common/Vector'
import ScenePointConfig from './BinOutput/ScenePoint'

export interface CityData {
  Id: number
  AreaIdVec: number[]
  MapPosX: number
  MapPosY: number
  AdventurePointId: number
  OpenState: string
}

export interface SceneTagData {
  Id: number
  Name: string
  Cond: {
    CondType: string
    Param1?: number
    Param2?: number
  }[]
  IsDefaultValid: boolean
}

export interface SceneData {
  Id: number
  Type: string
  IsMainScene: boolean
  IsLocked: boolean
  BeginPos: Vector
  Size: Vector
  BornPos: Vector
  BornRot: Vector
  DieY: number
  VisionAnchor: Vector
  SpecifiedAvatarList?: number[]
  MaxSpecifiedAvatarNum?: number
  City: CityData[]
  ScenePoint: ScenePointConfig
  Tag: SceneTagData[]
  Group: any
  Block: any
}

type SceneDataList = SceneData[]

export default SceneDataList