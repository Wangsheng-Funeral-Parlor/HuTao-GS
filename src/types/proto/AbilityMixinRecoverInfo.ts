import { MassivePropSyncInfo } from "."

export interface AbilityMixinRecoverInfo {
  instancedAbilityId?: number
  instancedModifierId?: number

  localId?: number
  dataList?: number[]
  isServerbuffModifier?: boolean
  massivePropList?: MassivePropSyncInfo[]
}
