import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBaseBillboard {
  AttachPoint: string
  Offset: DynamicVector
  OffsetType: string
  RadiusOffset: number
  EnableSelfAdapt: boolean
  ShowDistance: number
  MarkShowDistance: number
  NameShowDistance: number
}
