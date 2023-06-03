export interface FetterCond {
  CondType?: string
  ParamList?: number[]
}

export default interface FetterConfig {
  FetterId: number
  AvatarId: number
  OpenConds: FetterCond[]
  FinishConds: FetterCond[]
}
