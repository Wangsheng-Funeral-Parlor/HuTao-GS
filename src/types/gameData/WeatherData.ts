export interface WeatherTemplateData {
  WeatherType: string

  SunnyProb?: number
  CloudyProb?: number
  RainProb?: number
  ThunderstormProb?: number
  SnowProb?: number
  MistProb?: number
}

export interface WeatherData {
  AreaID: number
  WeatherAreaId: number
  MaxHeightStr: string
  Templates: WeatherTemplateData[]
  Priority: number
  ProfileName: string
  DefaultClimate: string
  SceneID: number

  GadgetID?: number
  IsDefaultValid?: boolean
  IsUseDefault?: boolean
}

type WeatherDataList = WeatherData[]
export default WeatherDataList
