import Loader from "$/gameData/loader"
import WeatherDataList, { WeatherData } from "@/types/gameData/WeatherData"

class WeatherDataLoader extends Loader {
  declare data: WeatherDataList

  constructor() {
    super("WeatherData", "message.cache.debug.weather")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getWeatherData(areaId: number): WeatherData {
    return this.data?.find((data) => data.AreaID === areaId)
  }
}

let loader: WeatherDataLoader
export default (() => (loader = loader || new WeatherDataLoader()))()
