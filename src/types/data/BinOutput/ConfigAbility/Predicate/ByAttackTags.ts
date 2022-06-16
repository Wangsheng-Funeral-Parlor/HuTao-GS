import { Predicate } from '.'

export default interface ByAttackTags extends Predicate {
  AttackTags: string[]
}