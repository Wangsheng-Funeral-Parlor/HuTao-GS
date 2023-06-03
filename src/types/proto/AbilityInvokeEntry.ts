import { AbilityInvokeArgumentEnum, ForwardTypeEnum } from "./enum"

import { AbilityInvokeEntryHead } from "."

export interface AbilityInvokeEntry {
  head: AbilityInvokeEntryHead
  argumentType: AbilityInvokeArgumentEnum
  abilityData: string
  entityId: number
  forwardType: ForwardTypeEnum
  forwardPeer: number
  eventId: number
  totalTickTime: number
  isIgnoreAuth?: boolean
}
