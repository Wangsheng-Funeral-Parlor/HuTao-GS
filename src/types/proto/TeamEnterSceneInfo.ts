import { AbilityControlBlock, AbilitySyncStateInfo } from "."

export interface TeamEnterSceneInfo {
  teamEntityId: number
  teamAbilityInfo: AbilitySyncStateInfo
  abilityControlBlock: AbilityControlBlock
}
