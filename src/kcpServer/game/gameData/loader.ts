import { getJsonAsync, hasJsonAsync } from '@/utils/json'
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
  }

  async load() {
    const { path, defaultData } = this
    const filePath = `${DATA_DIR}/${path}.json`

    if (!await hasJsonAsync(filePath)) logger.warn('Missing data:', path)

    this.data = await getJsonAsync(filePath, defaultData)
  }

  async getData() {
    if (this.data == null) await this.load()
    return this.data
  }
}