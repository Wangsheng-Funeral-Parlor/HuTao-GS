import { SelectTarget } from '.'

export default interface SelectTargetBySelfGroup extends SelectTarget {
  Operation: string
  Value: number
  UseBinary: boolean
  CompareType: string
}