import Handler, { HttpRequest, HttpResponse } from '#/handler'
import GlobalState from '@/globalState'
import Logger from '@/logger'
import { RecorderLog, RecorderLogData } from '@/types/log/recorder'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { join } from 'path'
import { cwd } from 'process'

const logger = new Logger('LOGREC', 0xa0ffa0)

class LogRecorderHandler extends Handler {
  constructor() {
    super(/^.*?uspider\..*$/, '/log')
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const {
      userName,
      auid,
      uid,
      time,
      frame,
      stackTrace,
      logStr,
      logType,
      deviceName,
      deviceModel,
      operatingSystem,
      version,
      exceptionSerialNum,
      pos,
      guid,
      errorCode,
      errorCodeToPlatform,
      subErrorCode,
      cpuInfo,
      gpuInfo,
      memoryInfo,
      clientIp,
      errorLevel,
      errorCategory
    } = <RecorderLogData>req.body

    logger.debug(`[UID:${uid.toString() || '-'.repeat(6)}]`, logStr)

    if (GlobalState.get('SaveRecorder')) {
      const path = join(cwd(), 'data/log/client/recorder.json')
      const exists = await fileExists(path)

      const log: RecorderLog = JSON.parse(exists ? (await readFile(path)).toString() : null) || {}
      const { playerMap } = log[userName] = log[userName] || { name: userName, playerMap: {} }
      const { entryList } = playerMap[auid] = playerMap[auid] || { auid, uid, entryList: [] }

      if (!playerMap[auid].uid && uid) playerMap[auid].uid = uid

      entryList.push({
        time,
        frame,
        stackTrace,
        logStr,
        logType,
        deviceName,
        deviceModel,
        operatingSystem,
        version,
        exceptionSerialNum,
        pos,
        guid,
        errorCode,
        errorCodeToPlatform,
        subErrorCode,
        cpuInfo,
        gpuInfo,
        memoryInfo,
        clientIp,
        errorLevel,
        errorCategory
      })

      await writeFile(path, JSON.stringify(log, null, 2))
    }

    return new HttpResponse({ code: 0 })
  }
}

let handler: LogRecorderHandler
export default (() => handler = handler || new LogRecorderHandler())()