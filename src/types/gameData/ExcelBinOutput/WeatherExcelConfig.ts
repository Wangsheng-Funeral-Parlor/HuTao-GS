export interface WeatherExcelConfig {
  AreaID: number
  WeatherAreaId: number
  MaxHeightStr: string
  TemplateName: string
  Priority: number
  ProfileName: string
  DefaultClimate: string
  SceneID: number

  GadgetID?: number
  IsDefaultValid?: boolean
  IsUseDefault?: boolean
}

type WeatherExcelConfigList = WeatherExcelConfig[]
export default WeatherExcelConfigList