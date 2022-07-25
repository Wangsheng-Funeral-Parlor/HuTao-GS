import { CombatTypeArgumentEnum, ForwardTypeEnum } from './enum'

export interface CombatInvokeEntry {
  argumentType: CombatTypeArgumentEnum
  forwardType: ForwardTypeEnum
  combatData: string
}