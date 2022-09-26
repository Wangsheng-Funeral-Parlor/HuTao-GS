import config from '@/config'
import TLogger from '@/translate/tlogger'
import { waitUntil } from '@/utils/asyncWait'
import { getJsonAsync, hasJsonAsync } from '@/utils/json'

const DATA_DIR = 'data/game/' + config.version

const logger = new TLogger('LOADER', 0x34fa69)

export default class Loader {
  path: string
  defaultData: any

  busy: boolean
  data: any

  constructor(path: string, defaultData: any = {}) {
    this.path = path
    this.defaultData = defaultData
  }

  async load() {
    const { path, defaultData, busy } = this
    const filePath = `${DATA_DIR}/${path}.json`

    if (busy) return waitUntil(() => !this.busy)
    this.busy = true

    if (!await hasJsonAsync(filePath)) logger.warn('message.loader.warn.noData', path)
    this.data = await getJsonAsync(filePath, defaultData)

    this.busy = false
  }

  async getData() {
    if (this.data == null) await this.load()
    return this.data
  }
}