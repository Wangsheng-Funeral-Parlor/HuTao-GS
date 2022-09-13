import { SelectTargets } from '.'

export default interface SelectTargetsBySelfGroup extends SelectTargets {
  Operation: string
  Value: number
  UseBinary: boolean
  CompareType: string
}