import { Predicate } from '.'

export default interface ByTargetGlobalValue extends Predicate {
  Target?: string
  Key: string
  Value: number
  CompareType?: string
}