import { MonsterBornTypeEnum } from "./enum"

import { MonsterRoute, SceneFishInfo, SceneWeaponInfo } from "."

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
