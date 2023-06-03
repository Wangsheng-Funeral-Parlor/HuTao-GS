export interface WeatherTemplateExcelConfig {
  TemplateName: string
  WeatherType: string

  SunnyProb?: number
  CloudyProb?: number
  RainProb?: number
  ThunderstormProb?: number
  SnowProb?: number
  MistProb?: number
}

type WeatherTemplateExcelConfigList = WeatherTemplateExcelConfig[]
export default WeatherTemplateExcelConfigList
