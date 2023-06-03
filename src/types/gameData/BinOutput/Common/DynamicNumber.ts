export type DynamicFloat = number | string | (number | string)[]
export type DynamicInt = number | string | (number | string)[]
export interface DynamicVector {
  X: DynamicFloat | DynamicInt
  Y: DynamicFloat | DynamicInt
  Z: DynamicFloat | DynamicInt
}
