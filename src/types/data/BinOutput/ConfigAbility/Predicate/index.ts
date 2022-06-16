import ByAnimatorBool from './ByAnimatorBool'
import ByAttackTags from './ByAttackTags'
import ByEntityTypes from './ByEntityTypes'
import ByTargetGlobalValue from './ByTargetGlobalValue'
import ByTargetPositionToSelfPosition from './ByTargetPositionToSelfPosition'

export interface Predicate {
  $type: string
}

type PredicateConfig =
  ByAnimatorBool |
  ByAttackTags |
  ByEntityTypes |
  ByTargetGlobalValue |
  ByTargetPositionToSelfPosition

export default PredicateConfig