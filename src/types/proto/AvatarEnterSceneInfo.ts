import { AbilitySyncStateInfo, ServerBuff } from './'

export interface AvatarEnterSceneInfo {
  avatarGuid?: string
  avatarEntityId?: number
  avatarAbilityInfo?: AbilitySyncStateInfo
  buffIdList?: number[]
  weaponGuid?: string
  weaponEntityId?: number
  weaponAbilityInfo?: AbilitySyncStateInfo
  serverBuffList?: ServerBuff[]
}