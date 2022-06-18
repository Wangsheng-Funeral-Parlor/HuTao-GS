import { MonsterBornTypeEnum } from '../enum/monster'
import { VectorInterface } from './motion'
import { MonsterRoute } from './route'
import { SceneWeaponInfo } from './weapon'

export interface AiSyncInfo {
  entityId: number
  hasPathToTarget?: boolean
  isSelfKilling?: boolean
}

export interface SceneFishInfo {
  fishId: number
  fishPoolEntityId: number
  fishPoolPos: VectorInterface
  fishPoolGadgetId: number
}

export interface SceneMonsterInfo {
  fishInfo?: SceneFishInfo

  monsterId: number
  groupId: number
  configId: number
  weaponList: SceneWeaponInfo[]
  authorityPeerId: number
  affixList?: number[]
  isElite?: boolean
  ownerEntityId?: number
  summonedTag?: number
  summonTagMap?: { [id: number]: number }
  poseId?: number
  bornType: MonsterBornTypeEnum
  blockId: number
  markFlag?: number
  titleId: number
  specialNameId: number
  attackTargetId?: number
  monsterRoute?: MonsterRoute
  aiConfigId?: number
  levelRouteId?: number
  initPoseId?: number
}