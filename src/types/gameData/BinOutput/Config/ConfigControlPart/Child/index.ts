import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBaseControlPart {
  AngularSpeed: number
  PartRootName: string
  ForwardBy: string
  ForwardAxialFix: DynamicVector
  RotateBy: string
  DoOnUnEabled: string
  ForwardByTransName: string
  LimitHorizontal: number
  LimitVertical: number
  TargetType: string
}
