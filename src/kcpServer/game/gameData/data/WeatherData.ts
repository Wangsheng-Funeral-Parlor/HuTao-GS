import Loader from '$/gameData/loader'
import WeatherDataList, { WeatherData } from '@/types/gameData/WeatherData'

class WeatherDataLoader extends Loader {
  declare data: WeatherDataList

  constructor() {
    super('WeatherData')
  }

  async getData(): Promise<WeatherDataList> {
    return super.getData()
  }

  async getWeatherData(areaId: number): Promise<WeatherData> {
    return (await this.getData()).find(data => data.AreaID === areaId)
  }
}

let loader: WeatherDataLoader
export default (() => loader = loader || new WeatherDataLoader())()