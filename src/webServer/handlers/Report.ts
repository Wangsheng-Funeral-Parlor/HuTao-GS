import Handler, { HttpRequest, HttpResponse } from '#/handler'
import { fileExists } from '@/utils/fileSystem'
import fs from 'fs'
import { join } from 'path'
import { cwd } from 'process'
const { readFile, writeFile } = fs.promises

class ReportHandler extends Handler {
  constructor() {
    super(
      /^.*?log-upload.*?\..*$/,
      [
        '/crash/dataUpload',
        '/perf/config/verify',
        '/perf/dataUpload',
        '/sdk/dataUpload',
        '/log/sdk/upload'
      ],
      true
    )
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    if (req.url.pathname.indexOf('verify') === -1 && req.getGState('SaveReport')) {
      const path = join(cwd(), 'data/log/client/report.json')
      const exists = await fileExists(path)

      let log = JSON.parse(exists ? await readFile(path, 'utf8') : null) || []
      if (!Array.isArray(log)) log = []

      log.push(...req.body)

      await writeFile(path, JSON.stringify(log, null, 2))
    }

    return new HttpResponse({ code: -1, message: 'not matched' })
  }
}

let handler: ReportHandler
export default (() => handler = handler || new ReportHandler())()