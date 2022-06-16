import { AbilityControlBlock, AbilitySyncStateInfo } from './ability'

export interface MPLevelEntityInfo {
  entityId: number
  authorityPeerId: number
  abilityInfo: AbilitySyncStateInfo
}

export interface PlayerWorldSceneInfo {
  sceneId: number
  isLocked: boolean
  sceneTagIdList: number[]
}

export interface ScenePlayBattleInfo {
  playId: number
  playType: number
  state: number
  prepareEndTime: number
  startTime: number
  duration: number
  progressStageList: number[]
  progress: number
  mode: number
  type: number
}

export interface TeamEnterSceneInfo {
  teamEntityId: number
  teamAbilityInfo: AbilitySyncStateInfo
  abilityControlBlock: AbilityControlBlock
}