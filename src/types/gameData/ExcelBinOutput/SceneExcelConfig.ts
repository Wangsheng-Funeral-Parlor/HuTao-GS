export interface SceneExcelConfig {
  Id: number
  Type: string
  ScriptData: string
  OverrideDefaultProfile: string
  LevelEntityConfig: string
  SpecifiedAvatarList: number[]

  EntityAppearSorted?: number
  Comment: string
  MaxSpecifiedAvatarNum?: number
  IsMainScene?: boolean
  IsLocked?: boolean
}

type SceneExcelConfigList = SceneExcelConfig[]

export default SceneExcelConfigList
