import { DynamicFloat, DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigTornadoZone {
  ShapeName: string
  Offset: DynamicVector
  Dir: DynamicVector
  Strength: DynamicFloat
  Attenuation: DynamicFloat
  InnerRadius: DynamicFloat
  ModifierName: string
  MaxNum: number
  ForceGrowth: number
  ForceFallen: number
  Duration: number
}
