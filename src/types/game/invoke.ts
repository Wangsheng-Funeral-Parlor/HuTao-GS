import { AbilityInvokeArgument, CombatTypeArgumentEnum, ForwardTypeEnum } from '../enum/invoke'

export interface AbilityInvokeEntry {
  head: AbilityInvokeEntryHead
  argumentType: AbilityInvokeArgument
  abilityData: string
  entityId: number
  forwardType: ForwardTypeEnum
  forwardPeer: number
  eventId: number
  totalTickTime: number
}

export interface AbilityInvokeEntryHead {
  instancedAbilityId: number
  instancedModifierId: number
  localId: number
  modifierConfigLocalId: number
  targetId: number
  isServerbuffModifier: boolean
  serverBuffUid: number
}

export interface CombatInvokeEntry {
  argumentType: CombatTypeArgumentEnum
  forwardType: ForwardTypeEnum
  combatData: string
}