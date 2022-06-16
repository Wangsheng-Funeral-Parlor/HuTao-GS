import { DynamicNumber } from './Dynamic'

export default interface Vector {
  X: number | DynamicNumber
  Y: number | DynamicNumber
  Z: number | DynamicNumber
}