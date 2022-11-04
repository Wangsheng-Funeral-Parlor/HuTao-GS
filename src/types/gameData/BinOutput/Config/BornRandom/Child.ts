import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'

export interface BornRandomFromCenter {
  $type: 'BornRandomFromCenter'
  MinRandomRange: DynamicFloat
  MaxRandomRange: DynamicFloat
}

export interface BornRandomInShape {
  $type: 'BornRandomInShape'
  ShapeName: string
}