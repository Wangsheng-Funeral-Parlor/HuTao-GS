import { AbilitySyncStateInfo } from '.'

export interface PlayTeamEntityInfo {
  entityId: number
  playerUid: number
  authorityPeerId: number
  gadgetConfigId: number
  abilityInfo: AbilitySyncStateInfo
}