import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'

export default interface ConfigModifierStackingOption {
  AbilitySpecialName: string
  UniqueModifierCondition: string
  MaxModifierNumForMultipleType: DynamicFloat
  EnableMixedUnique: boolean
}