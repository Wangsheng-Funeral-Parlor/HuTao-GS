import ConfigBaseSelectTargets from "."

export default interface SelectTargetsBySelfGroup extends ConfigBaseSelectTargets {
  $type: "SelectTargetsBySelfGroup"
  Operation: string
  Value: number
  UseBinary: boolean
  CompareType: string
}
