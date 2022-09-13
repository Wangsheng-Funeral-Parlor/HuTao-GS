import BornRandomConfig from '../BornRandom'
import Vector from '../Vector'
import ConfigBornByCollisionPoint from './ConfigBornByCollisionPoint'
import ConfigBornByHitPoint from './ConfigBornByHitPoint'
import ConfigBornByPredicatePoint from './ConfigBornByPredicatePoint'
import ConfigBornBySelf from './ConfigBornBySelf'
import ConfigBornByTarget from './ConfigBornByTarget'

export interface Born {
  $type: string
  Offset?: Vector
  BornRandom?: BornRandomConfig
  OnGround?: boolean
  OnGroundIgnoreWater?: boolean
  OnGroundRaycastUpDist?: number
  /*Direction?: any*/ // ignore for now
  AlongGround?: boolean
  UseRotation?: boolean
}

type BornConfig =
  ConfigBornByCollisionPoint |
  ConfigBornByHitPoint |
  ConfigBornByPredicatePoint |
  ConfigBornBySelf |
  ConfigBornByTarget

export default BornConfig