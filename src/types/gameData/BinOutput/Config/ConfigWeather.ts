import ConfigElemBall from './ConfigElemBall'

export default interface ConfigWeather {
  DropElemBalls: ConfigElemBall[]
  ShapeName: string
  Position: number[]
  Priority: number
  DefaultEnviro: string
  WeatherList: string[]
  WeatherWeightList: number[]
  RefreshTime: number
}