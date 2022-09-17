import { DynamicVector } from '../BinOutput/Common/DynamicNumber'

export interface SceneGroupScriptConfig {
  Monsters: SceneMonsterScriptConfig[]
  Npcs: SceneNpcScriptConfig[]
  Gadgets: SceneGadgetScriptConfig[]
  Regions: SceneRegionScriptConfig[]
  Triggers: SceneTriggerScriptConfig[]
  Points: ScenePointScriptConfig[]
  Variables: SceneVariableScriptConfig[]
  MonsterPools: SceneMonsterPoolScriptConfig[]
  InitConfig: {
    Suite: number
    EndSuite: number
    RandSuite: boolean
  }
  Suites: SceneSuiteScriptConfig[]

  // Is there a better way to do this? I'm too lazy to search :p
  /* key: Action_EVENT_[Trigger->Name] | Condition_EVENT_[Trigger->Name] */
  [key: string]: SceneActionScriptConfig[] | SceneConditionScriptConfig[] | any
}

export interface SceneMonsterScriptConfig {
  ConfigId: number
  MonsterId: number
  Pos: DynamicVector
  Rot: DynamicVector
  Level: number
  DropTag: string
  PoseId?: number
  IsElite?: boolean
  AreaId: number
}

export interface SceneNpcScriptConfig {
  ConfigId: number
  NpcId: number
  Pos: DynamicVector
  Rot: DynamicVector
  AreaId: number
}

export interface SceneGadgetScriptConfig {
  ConfigId: number
  GadgetId: number
  Pos: DynamicVector
  Rot: DynamicVector
  Level: number
  DropTag: string
  IsOneoff?: boolean
  Persistent?: boolean
  InteractId?: number
  Explore?: {
    Name: string
    Exp: number
  }
  AreaId: number
}

export interface SceneRegionScriptConfig {
  ConfigId: number
  Shape: {}
  Radius: number
  Pos: DynamicVector
  AreaId: number
}

export interface SceneTriggerScriptConfig {
  ConfigId: number
  Name: string
  Event: {}
  Source: string
  Condition: string
  Action: string
}

export interface ScenePointScriptConfig {
  ConfigId: number
  Pos: DynamicVector
  Rot: DynamicVector
  AreaId: number
}

export interface SceneVariableScriptConfig {
  ConfigId: number
  Name: string
  Value: number
  NoRefresh: boolean
}

export interface SceneMonsterPoolScriptConfig {
  PoolId: number
  RandWeight: number
}

export interface SceneSuiteScriptConfig {
  Monsters: number[]
  Npcs: number[]
  Gadgets: number[]
  Regions: number[]
  Triggers: number[]
  RandWeight: number
}

export interface SceneActionScriptConfig {
  Monsters: number[]
  Npcs: number[]
  Gadgets: number[]
  Regions: number[]
  Triggers: string[]
  RandWeight: number
}

export interface SceneConditionScriptConfig {
  Monsters: number[]
  Npcs: number[]
  Gadgets: number[]
  Regions: number[]
  Triggers: string[]
  RandWeight: number
}

export interface SceneBlockScriptConfig {
  Groups: {
    Id: number
    Area: number
    Pos: DynamicVector
    DynamicLoad?: boolean
    IsReplaceable?: {
      Value: boolean
      Version: number
      NewBinOnly: boolean
    }
    Business?: {
      Type: number
    }
    VisionType?: number
  }[]
  Rect: {
    Min: DynamicVector
    Max: DynamicVector
  } | null
}

export interface SceneScriptConfig {
  Config: {
    BeginPos: DynamicVector
    Size: DynamicVector
    BornPos: DynamicVector
    BornRot: DynamicVector
    DieY: number
    VisionAnchor: DynamicVector
  }
  Group: { [groupId: number]: SceneGroupScriptConfig }
  Block: { [blockId: number]: SceneBlockScriptConfig }
}

export default interface SceneScriptConfigMap { [sceneId: number]: SceneScriptConfig }