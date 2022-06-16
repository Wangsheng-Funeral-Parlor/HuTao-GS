import ConfigBornByCollisionPoint from './ConfigBornByCollisionPoint'
import ConfigBornByHitPoint from './ConfigBornByHitPoint'
import ConfigBornByPredicatePoint from './ConfigBornByPredicatePoint'
import ConfigBornBySelf from './ConfigBornBySelf'
import ConfigBornByTarget from './ConfigBornByTarget'

export interface Born {
  $type: string
}

type BornConfig =
  ConfigBornByCollisionPoint |
  ConfigBornByHitPoint |
  ConfigBornByPredicatePoint |
  ConfigBornBySelf |
  ConfigBornByTarget

export default BornConfig