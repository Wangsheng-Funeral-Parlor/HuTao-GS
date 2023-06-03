import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBornDirectionType {
  AngleOffset: DynamicVector
  AngleOffsetCorrect: DynamicVector
  RandomAngleHor: number
  RandomAngleVer: number
  MaxAngleType: string
  MaxAngle: number
}
