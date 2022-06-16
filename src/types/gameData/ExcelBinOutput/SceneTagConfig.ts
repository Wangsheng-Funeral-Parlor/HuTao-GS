export interface SceneTagConfig {
  Id: number
  SceneTagName: string
  SceneId: number
  Cond: {
    CondType?: string
    Param1?: number
    Param2?: number
  }[]

  IsDefaultValid?: boolean
}

type SceneTagConfigList = SceneTagConfig[]

export default SceneTagConfigList