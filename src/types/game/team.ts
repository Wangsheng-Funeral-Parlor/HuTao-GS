import { AbilityControlBlock, AbilitySyncStateInfo } from './ability'
import { AvatarInfo, SceneAvatarInfo, ServerBuff } from './avatar'
import { SceneEntityInfo } from './entity'

export interface AvatarTeam {
  avatarGuidList: string[]
  teamName?: string
}

export interface PlayTeamEntityInfo {
  entityId: number
  playerUid: number
  authorityPeerId: number
  gadgetConfigId: number
  abilityInfo: AbilitySyncStateInfo
}

export interface SceneTeamAvatar {
  playerUid: number
  avatarGuid: string
  sceneId: number
  entityId: number
  avatarInfo?: AvatarInfo
  sceneAvatarInfo?: SceneAvatarInfo
  avatarAbilityInfo: AbilitySyncStateInfo
  serverBuffList?: ServerBuff[]
  sceneEntityInfo: SceneEntityInfo
  weaponGuid: string
  weaponEntityId: number
  weaponAbilityInfo: AbilitySyncStateInfo
  abilityControlBlock?: AbilityControlBlock
  isReconnect?: boolean
  isPlayerCurAvatar?: boolean
  isOnScene?: boolean
}

export interface TeamEntityInfo {
  teamEntityId: number
  authorityPeerId: number
  teamAbilityInfo: AbilitySyncStateInfo
}