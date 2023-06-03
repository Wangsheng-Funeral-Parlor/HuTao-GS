import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface GlobalValuePair {
  Key: string
  Value: DynamicFloat
  UseLimitRange: boolean
  RandomInRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}
