import { AbilityInvokeEntryHead } from '.'
import { AbilityInvokeArgumentEnum, ForwardTypeEnum } from './enum'

export interface AbilityInvokeEntry {
  head: AbilityInvokeEntryHead
  argumentType: AbilityInvokeArgumentEnum
  abilityData: string
  entityId: number
  forwardType: ForwardTypeEnum
  forwardPeer: number
  eventId: number
  totalTickTime: number
}