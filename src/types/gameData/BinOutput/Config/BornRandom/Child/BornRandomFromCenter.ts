import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'

export default interface BornRandomFromCenter {
  $type: 'BornRandomFromCenter'
  MinRandomRange: DynamicFloat
  MaxRandomRange: DynamicFloat
}