import { Predicate } from '.'

export default interface ByTargetGlobalValue extends Predicate {
  Key: string
  Value: number
  CompareType?: string
}