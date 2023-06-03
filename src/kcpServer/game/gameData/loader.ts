import config from "@/config"
import TLogger from "@/translate/tlogger"
import { waitUntil } from "@/utils/asyncWait"
import { getJsonAsync, hasJsonAsync } from "@/utils/json"

const DATA_DIR = "data/game/" + config.game.version

const logger = new TLogger("LOADER", 0x34fa69)

export default class Loader {
  path: string
  tlogKey: string
  defaultData: any

  loggedMessagesMap: { [key: string]: number }

  busy: boolean
  data: any

  constructor(path: string, tlogKey: string, defaultData: any = {}) {
    this.path = path
    this.tlogKey = tlogKey
    this.defaultData = defaultData

    this.loggedMessagesMap = {}
  }

  private canLog(key: string): boolean {
    const { loggedMessagesMap } = this
    if (loggedMessagesMap[key] == null) loggedMessagesMap[key] = 0
    if (loggedMessagesMap[key] >= 10) return false
    loggedMessagesMap[key]++
    return true
  }

  error(key: string, ...params: any[]) {
    if (!this.canLog(key)) return
    logger.error(key, ...params)
  }

  warn(key: string, ...params: any[]) {
    if (!this.canLog(key)) return
    logger.warn(key, ...params)
  }

  info(key: string, ...params: any[]) {
    if (!this.canLog(key)) return
    logger.info(key, ...params)
  }

  debug(key: string, ...params: any[]) {
    if (!this.canLog(key)) return
    logger.debug(key, ...params)
  }

  async load() {
    const { path, defaultData, busy } = this
    const filePath = `${DATA_DIR}/${path}.json`

    if (busy) return waitUntil(() => !this.busy)
    this.busy = true

    if (!(await hasJsonAsync(filePath))) logger.warn("message.loader.warn.noData", path)
    this.data = await getJsonAsync(filePath, defaultData)

    this.busy = false
  }

  async getData() {
    if (this.data == null) await this.load()

    logger.info(this.tlogKey)
  }
}
