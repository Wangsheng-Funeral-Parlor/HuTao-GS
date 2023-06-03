import fs from "fs"
import { join } from "path"
import { cwd } from "process"

import Handler, { HttpRequest, HttpResponse } from "#/handler"
import GlobalState from "@/globalState"
import { fileExists } from "@/utils/fileSystem"
const { readFile, writeFile } = fs.promises

class ReportHandler extends Handler {
  constructor() {
    super(
      /^.*?log-upload.*?\..*$/,
      [
        "/client/event/dataUpload",
        "/crash/dataUpload",
        "/perf/config/verify",
        "/perf/dataUpload",
        "/sdk/dataUpload",
        "/log/sdk/upload",
      ],
      true
    )
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    if (req.url.pathname.indexOf("verify") === -1 && GlobalState.get("SaveReport")) {
      const path = join(cwd(), "data/log/client/report.json")
      const exists = await fileExists(path)

      let log = JSON.parse(exists ? await readFile(path, "utf8") : null) || []
      if (!Array.isArray(log)) log = []

      log.push(...req.body)

      await writeFile(path, JSON.stringify(log, null, 2))
    }

    return new HttpResponse({ code: -1, message: "not matched" })
  }
}

let handler: ReportHandler
export default (() => (handler = handler || new ReportHandler()))()
