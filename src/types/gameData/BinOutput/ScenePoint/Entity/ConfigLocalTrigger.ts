import Vector from '../../Common/Vector'
import { Entity } from '.'
import ShapeConfig from '../Shape'

export default interface ConfigLocalTrigger extends Entity {
  Unlocked?: boolean
  CheckDist?: number
  WithGO?: boolean
  TriggerFlag: string
  Shape: ShapeConfig
  VectorParam?: Vector
  FloatParam: number
  StringParam: string
}