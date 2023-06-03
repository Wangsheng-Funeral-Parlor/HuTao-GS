import { join } from "path"
import { cwd } from "process"

import Handler, { HttpRequest, HttpResponse } from "#/handler"
import config from "@/config"
import GlobalState from "@/globalState"
import curRegion from "@/tools/autoPatch/curRegion"
import regionList from "@/tools/autoPatch/regionList"
import translate from "@/translate"
import TError from "@/translate/terror"
import TLogger from "@/translate/tlogger"
import { QueryCurrRegionHttpRsp, QueryRegionListHttpRsp } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import DispatchKey from "@/utils/dispatchKey"
import { fileExists, readFile } from "@/utils/fileSystem"
import { dataToProtobuffer, objToProtobuffer } from "@/utils/proto"
import { rsaEncrypt, rsaSign } from "@/utils/rsa"
import { getTimeSeconds } from "@/utils/time"
import { versionStrToNum } from "@/utils/version"
import { xor } from "@/utils/xor"

const logger = new TLogger("DIPREQ", 0xffaa00)

const { kcpPort } = config
const { serverName, version, hostIp } = config.game
const { dispatchHost, dispatchRegion, autoPatch } = config.dispatch

const clientCustomConfig = {
  sdkenv: dispatchRegion.slice(0, 2) === "CN" ? "9" : "2",
  checkdevice: false,
  showexception: false,
  regionConfig: "pm|fk|add",
  downloadMode: "0",

  // probably useless, but who cares
  debugmenu: true,
  debuglog: true,
}

class DispatchHandler extends Handler {
  nfvcCache: string

  constructor() {
    super(
      [/(.*?dispatch.*?|api-beta-sdk)\./, /^(?:\d{1,3}\.){3}\d{1,3}$/],
      ["/query_cur_region", "/query_region_list", "/query_security_file", "/dispatch/dispatch/getGateAddress"]
    )
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const path = req.url.pathname.split("/").slice(-1)[0]
    logger.debug("message.dispatch.debug.reqInfo", req.searchParams.toString())
    switch (path) {
      case "query_cur_region":
        return this.queryCurRegion(req)
      case "query_region_list":
        return this.queryRegionList(req)
      case "getGateAddress":
        return this.getGateAddress(req)
      default:
        return new HttpResponse("404 page not found", 404)
    }
  }

  private async queryCurRegion(req: HttpRequest): Promise<HttpResponse> {
    const { searchParams } = req
    const clientVersion = versionStrToNum(searchParams.get("version"))

    let response: string | { content: string; sign: string }
    switch (true) {
      case clientVersion >= 0x020732: {
        // >= 2.7.50
        const keyId = parseInt(searchParams.get("key_id")) || 0
        const keyPairs = await DispatchKey.getKeyPairs(keyId)
        const encoded = await this.curRegionRsp(
          searchParams.get("dispatchSeed"),
          searchParams
            .get("version")
            .toString()
            .replace(/[^\d.]/g, "")
        )

        response = {
          content: rsaEncrypt(keyPairs.client.public, encoded).toString("base64"),
          sign: rsaSign(keyPairs.server.private, encoded).toString("base64"),
        }
        break
      }
      case clientVersion >= 0x910: {
        // >= 0.9.16
        response = (
          await this.curRegionRsp(
            searchParams.get("dispatchSeed"),
            searchParams
              .get("version")
              .toString()
              .replace(/[^\d.]/g, "")
          )
        ).toString("base64")
        break
      }
      default: {
        response = await this.curRegionRspNFVC()
      }
    }

    return new HttpResponse(response)
  }

  private async queryRegionList(req: HttpRequest): Promise<HttpResponse> {
    const { searchParams } = req
    const clientVersion = versionStrToNum(searchParams.get("version"))

    let regionListData: QueryRegionListHttpRsp

    if (autoPatch) {
      if (!(await regionList.checkForUpdate())) throw new TError("message.dispatch.error.updateFail")

      const binPath = join(cwd(), `data/bin/${version}/QueryRegionListHttpRsp.bin`)
      if (!(await fileExists(binPath))) throw new TError("generic.fileNotFound", binPath)

      regionListData = await dataToProtobuffer(await readFile(binPath), "QueryRegionListHttpRsp", true)
    } else {
      const customConfig = Buffer.from(JSON.stringify(clientCustomConfig))
      xor(customConfig, await DispatchKey.getXorKey())

      regionListData = {
        retcode: RetcodeEnum.RET_SUCC,
        regionList: ["usa", "euro", "asia", "cht"].map((r) => ({
          name: `os_${r}`,
          title: "",
          type: "DEV_PUBLIC",
          dispatchUrl: "",
        })),
        clientSecretKey: (await DispatchKey.getEc2b()).toString("base64"),
        clientCustomConfigEncrypted: customConfig.toString("base64"),
        enableLoginPc: true,
      }
    }

    const host = dispatchHost || hostIp

    for (const region of regionListData.regionList) {
      region.title = serverName
      region.dispatchUrl = `${clientVersion <= 0x020000 ? "http" : "https"}://${host}/query_cur_region`
    }

    return new HttpResponse((await objToProtobuffer(regionListData, "QueryRegionListHttpRsp", true)).toString("base64"))
  }

  private async getGateAddress(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: "OK",
      data: {
        address_list: [],
      },
    })
  }

  private async curRegionRsp(seed?: string, clientVersion?: string): Promise<Buffer> {
    let curRegionData: QueryCurrRegionHttpRsp

    if (autoPatch) {
      if (!(await curRegion.checkForUpdate(seed))) throw new TError("message.dispatch.error.updateFail")

      const binPath = join(cwd(), `data/bin/${version}/QueryCurrRegionHttpRsp.bin`)
      if (!(await fileExists(binPath))) throw new TError("generic.fileNotFound", binPath)

      curRegionData = await dataToProtobuffer(await readFile(binPath), "QueryCurrRegionHttpRsp", true)
    } else {
      if (clientVersion === version || !GlobalState.get("KickMismatchVersion")) {
        const customConfig = Buffer.from(JSON.stringify(clientCustomConfig))
        xor(customConfig, await DispatchKey.getXorKey())

        const secretKey = (await DispatchKey.getEc2b()).toString("base64")

        curRegionData = {
          retcode: RetcodeEnum.RET_SUCC,
          regionInfo: {
            secretKey,
            cdkeyUrl:
              "https://hk4e-api.mihoyo.com/common/apicdkey/api/exchangeCdkey?sign_type=2&auth_appid=apicdkey&authkey_ver=1",
            gateserverIp: hostIp,
            gateserverPort: Array.isArray(kcpPort) ? kcpPort[Math.floor(Math.random() * kcpPort.length)] : kcpPort,
            payCallbackUrl: `https://${hostIp}/recharge`,
          },
          clientSecretKey: secretKey,
          clientRegionCustomConfigEncrypted: customConfig.toString("base64"),
        }

        return objToProtobuffer(curRegionData, "QueryCurrRegionHttpRsp", true)
      } else {
        const curRegionData: QueryCurrRegionHttpRsp = {
          retcode: RetcodeEnum.RET_STOP_SERVER,
          msg: translate("message.dispatch.error.msg"),
          regionInfo: {
            gateserverIp: hostIp,
            gateserverPort: Array.isArray(kcpPort) ? kcpPort[Math.floor(Math.random() * kcpPort.length)] : kcpPort,
            payCallbackUrl: `https://${hostIp}/recharge`,
          },
          stopServer: {
            url: "https://github.com/kuma-dayo/Hutao-GS",
            stopBeginTime: getTimeSeconds(),
            stopEndTime: getTimeSeconds() * 2,
            contentMsg: this.isNewerVersion(clientVersion, version)
              ? translate("message.dispatch.error.outdateServer", version, clientVersion)
              : translate("message.dispatch.error.outdateClient", version, clientVersion),
          },
        }

        return objToProtobuffer(curRegionData, "QueryCurrRegionHttpRsp", true)
      }
    }
  }

  private async curRegionRspNFVC(): Promise<string> {
    if (this.nfvcCache) return this.nfvcCache

    this.nfvcCache = (
      await objToProtobuffer(
        {
          retcode: RetcodeEnum.RET_SVR_ERROR,
          msg: "Not Found version config",
        },
        "QueryCurrRegionHttpRsp",
        true
      )
    ).toString("base64")

    return this.nfvcCache
  }

  isNewerVersion(clientVersion: string, serverVersion: string): boolean {
    const v1: number[] = clientVersion.split(".").map(Number)
    const v2: number[] = serverVersion.split(".").map(Number)

    for (let i = 0; i < v1.length; i++) {
      if (v1[i] > v2[i]) {
        return true
      } else if (v1[i] < v2[i]) {
        return false
      }
    }

    return false
  }
}

let handler: DispatchHandler
export default (() => (handler = handler || new DispatchHandler()))()
