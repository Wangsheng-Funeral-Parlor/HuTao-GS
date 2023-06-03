import { AbilityControlBlock, AbilitySyncStateInfo, AvatarInfo, SceneAvatarInfo, SceneEntityInfo, ServerBuff } from "."

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
