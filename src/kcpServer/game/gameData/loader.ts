import { getJson } from '@/utils/json'
import Logger from '@/logger'
import config from '@/config'

const DATA_DIR = 'data/game/' + config.version

const logger = new Logger('LOADER', 0x34fa69)

export default class Loader {
  path: string
  defaultData: any

  data: any

  constructor(path: string, defaultData: any = {}) {
    this.path = path
    this.defaultData = defaultData

    this.load()
  }

  load() {
    const { path, defaultData } = this
    const filePath = `${DATA_DIR}/${path}.json`

    this.data = getJson(filePath, defaultData)

    if (this.data == null) logger.warn('Missing data:', path)
  }
}