import Handler, { HttpRequest, HttpResponse } from "#/handler"
import config from "@/config"
import { UpdateApiRetcodeEnum } from "@/types/enum"
import { UpdateApiResponse } from "@/types/update"
import Update from "@/update"

const { hostUpdate } = config

class UpdateHandler extends Handler {
  constructor() {
    super(/.*/, /\/HuTao-GS-update($|\/)/)
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const path = req.url.pathname.split("/").slice(-1)[0]
    const update = req.webServer.server.update
    switch (path) {
      case "version":
        return this.version(req, update)
      case "get":
        return this.get(req, update)
      default:
        return new HttpResponse({ code: UpdateApiRetcodeEnum.UNKNOWN, msg: "API Not found" })
    }
  }

  private async version(_req: HttpRequest, update: Update): Promise<HttpResponse> {
    const rsp: UpdateApiResponse = {
      code: UpdateApiRetcodeEnum.SUCC,
      msg: "OK",
    }

    if (hostUpdate) {
      const buildVersion = update.getBuildVersion()
      if (buildVersion != null) {
        rsp.data = { v: buildVersion }
        return new HttpResponse(rsp)
      }
    }

    rsp.code = UpdateApiRetcodeEnum.NO_DATA
    rsp.msg = "No data"

    return new HttpResponse(rsp)
  }

  private async get(_req: HttpRequest, update: Update): Promise<HttpResponse> {
    const rsp: UpdateApiResponse = {
      code: UpdateApiRetcodeEnum.SUCC,
      msg: "OK",
    }

    if (hostUpdate) {
      const buildContent = await update.getBuildContent()
      if (buildContent != null) {
        rsp.data = buildContent
        return new HttpResponse(rsp)
      }
    }

    rsp.code = UpdateApiRetcodeEnum.NO_DATA
    rsp.msg = "No data"

    return new HttpResponse(rsp)
  }
}

let handler: UpdateHandler
export default (() => (handler = handler || new UpdateHandler()))()
