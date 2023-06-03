import { DynamicVector } from "./BinOutput/Common/DynamicNumber"
import ConfigScene from "./BinOutput/Config/ConfigScene"
import { SceneBlockScriptConfig, SceneGroupScriptConfig } from "./Script/SceneScriptConfig"

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
  BeginPos: DynamicVector
  Size: DynamicVector
  BornPos: DynamicVector
  BornRot: DynamicVector
  DieY: number
  VisionAnchor: DynamicVector
  SpecifiedAvatarList?: number[]
  MaxSpecifiedAvatarNum?: number
  City: CityData[]
  Config: ConfigScene
  Tag: SceneTagData[]
  Group: { [groupId: number]: SceneGroupScriptConfig }
  Block: { [blockId: number]: SceneBlockScriptConfig }
}

type SceneDataList = SceneData[]

export default SceneDataList
