import { LifeStateEnum, ProtEntityTypeEnum } from "./enum"

import {
  AnimatorParameterValueInfoPair,
  EntityAuthorityInfo,
  EntityClientData,
  EntityEnvironmentInfo,
  FightPropPair,
  MotionInfo,
  PropPair,
  SceneAvatarInfo,
  SceneGadgetInfo,
  SceneMonsterInfo,
  SceneNpcInfo,
  ServerBuff,
} from "."

export interface SceneEntityInfo {
  avatar?: SceneAvatarInfo
  monster?: SceneMonsterInfo
  npc?: SceneNpcInfo
  gadget?: SceneGadgetInfo

  entityType: ProtEntityTypeEnum
  entityId: number
  name?: string
  motionInfo: MotionInfo
  propList: PropPair[]
  fightPropList: FightPropPair[]
  lifeState?: LifeStateEnum
  animatorParaList: AnimatorParameterValueInfoPair[]
  lastMoveSceneTimeMs?: number
  lastMoveReliableSeq?: number
  entityClientData: EntityClientData
  entityEnvironmentInfoList?: EntityEnvironmentInfo[]
  entityAuthorityInfo: EntityAuthorityInfo
  tagList?: string[]
  serverBuffList?: ServerBuff[]
}
