import Vector from '../../Common/Vector'
import { Force } from '.'
import ShapeConfig from '../Shape'

export default interface ConfigRiseField extends Force {
  CdMin: number
  CdMax: number
  VMin: number
  VMax: number
  HMin: number
  HMax: number
  Attenuation: number
  Box: Vector
  Shape: ShapeConfig
}