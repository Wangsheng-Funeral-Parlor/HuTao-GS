export default interface ConfigAISkillCastCondition {
  Pose: number[]
  NeedReInitCD: boolean
  MinTargetAngleXZ: number
  MaxTargetAngleXZ: number
  MaxTargetAngleY: number
  MinTargetAngleY: number
  PickRangeMin: number
  PickRangeMax: number
  PickRangeYMax: number
  PickRangeYMin: number
  SkillAnchorRangeMin: number
  SkillAnchorRangeMax: number
  CastRangeMin: number
  CastRangeMax: number
  GlobalValues: string[]
  GlobalValuesLogicAnd: boolean
}