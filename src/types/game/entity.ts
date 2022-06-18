import { LifeStateEnum, ProtEntityTypeEnum } from '../enum/entity'
import { AbilitySyncStateInfo } from './ability'
import { SceneAvatarInfo, ServerBuff } from './avatar'
import { SceneGadgetInfo } from './gadget'
import { SceneMonsterInfo } from './monster'
import { MotionInfoInterface, VectorInterface } from './motion'
import { SceneNpcInfo } from './npc'
import { PropPair } from './prop'

// Config
export interface EntityFightPropConfig {
  HpBase: number
  AttackBase: number
  DefenseBase: number
  PropGrowCurves: {
    PropType: string
    Type: string
    Value?: number
  }[]

  // Avatar
  Critical?: number
  CriticalHurt?: number

  // Monster
  IceSubHurt?: number
  GrassSubHurt?: number
  WindSubHurt?: number
  ElecSubHurt?: number
  PhysicalSubHurt?: number
}

// Packet
export interface AnimatorParameterValueInfo {
  intVal?: number
  floatVal?: number
  boolVal?: boolean

  paraType: number
}

export interface AnimatorParameterValueInfoPair {
  nameId?: number
  animatorPara?: AnimatorParameterValueInfo
}

export interface EntityAuthorityInfo {
  abilityInfo: AbilitySyncStateInfo
  rendererChangedInfo: EntityRendererChangedInfo
  aiInfo: SceneEntityAiInfo
  bornPos: VectorInterface
  poseParaList?: AnimatorParameterValueInfoPair[]
}

export interface EntityClientData {
  windChangeSceneTime?: number
  windmillSyncAngle?: number
  windChangeTargetLevel?: number
}

export interface EntityEnvironmentInfo {
  jsonClimateType: number
  climateAreaId: number
}

export interface EntityRendererChangedInfo {
  changedRenderers?: { [id: number]: number }
  visibilityCount?: number
  isCached?: boolean
}

export interface FightPropPair {
  propType: number
  propValue?: number
}

export interface ServantInfo {
  masterEntityId: number
  bornSlotIndex: number
}

export interface SceneEntityAiInfo {
  isAiOpen?: boolean
  bornPos?: VectorInterface
  skillCdMap?: { [id: number]: number }
  servantInfo?: ServantInfo
  aiThreatMap?: { [id: number]: number }
  skillGroupCdMap?: { [id: number]: number }
  curTactic?: number
}

export interface SceneEntityInfo {
  avatar?: SceneAvatarInfo
  monster?: SceneMonsterInfo
  npc?: SceneNpcInfo
  gadget?: SceneGadgetInfo

  entityType: ProtEntityTypeEnum
  entityId: number
  name?: string
  motionInfo: MotionInfoInterface
  propList: PropPair[]
  fightPropList: FightPropPair[]
  lifeState: LifeStateEnum
  animatorParaList: AnimatorParameterValueInfoPair[]
  lastMoveSceneTimeMs?: number
  lastMoveReliableSeq?: number
  entityClientData: EntityClientData
  entityEnvironmentInfoList?: EntityEnvironmentInfo[]
  entityAuthorityInfo: EntityAuthorityInfo
  tagList?: string[]
  serverBuffList?: ServerBuff[]
}