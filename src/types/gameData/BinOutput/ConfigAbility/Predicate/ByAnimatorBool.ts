import { Predicate } from '.'

export default interface ByAnimatorBool extends Predicate {
  Parameter: string
  Value?: boolean
}