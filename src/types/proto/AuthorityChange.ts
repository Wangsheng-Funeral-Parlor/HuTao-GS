import { EntityAuthorityInfo } from "."

export interface AuthorityChange {
  entityId: number
  authorityPeerId: number
  entityAuthorityInfo: EntityAuthorityInfo
}
