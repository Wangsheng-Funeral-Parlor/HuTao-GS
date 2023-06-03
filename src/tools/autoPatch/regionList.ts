import * as dns from "dns"
import { existsSync, writeFileSync } from "fs"
import { get } from "https"
import { join } from "path"
import { cwd } from "process"

import config from "@/config"
import translate from "@/translate"
import TError from "@/translate/terror"
import TLogger from "@/translate/tlogger"
import { QueryRegionListHttpRsp } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import { fileExists } from "@/utils/fileSystem"
import { dataToProtobuffer } from "@/utils/proto"
const { Resolver } = dns.promises

const host = `dispatch${config.dispatch.dispatchRegion.slice(0, 2).toLowerCase()}global.yuanshen.com`
const protoPath = join(cwd(), `data/proto/QueryRegionListHttpRsp.proto`)
const binFilePath = join(cwd(), `data/bin/${config.game.version}/QueryRegionListHttpRsp.bin`)

const logger = new TLogger("APATCH")

function query(ip: string) {
  return new Promise<void>((resolve, reject) => {
    const path = `/query_region_list?version=${config.dispatch.dispatchRegion}Win${config.game.version}&lang=3&platform=3&binary=1&time=543&channel_id=1&sub_channel_id=0`
    logger.debug("message.tools.autoPatch.debug.reqInfo", "QueryRegionList", host, path)
    get(
      `https://${ip}${path}`,
      {
        headers: {
          Host: host,
          "User-Agent": "UnityPlayer/2017.4.30f1 (UnityWebRequest/1.0, libcurl/7.51.0-DEV)",
          Accept: "*/*",
          "Accept-Encoding": "identity",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Unity-Version": "2017.4.30f1",
        },
      },
      (res) => {
        const { statusCode } = res
        if (statusCode !== 200) {
          // Consume response data to free up memory
          res.resume()

          return reject(`HTTP ${statusCode}`)
        }

        let data = ""

        res.setEncoding("utf8")
        res.on("error", (err) => reject(translate("message.tools.autoPatch.error.reqFail", ip, host, err.message)))
        res.on("data", (chunk) => (data += chunk))
        res.on("end", async () => {
          try {
            const buf = Buffer.from(data, "base64")
            const regionListRsp = await dataToProtobuffer<QueryRegionListHttpRsp>(buf, "QueryRegionListHttpRsp", true)

            const retcode = regionListRsp.retcode || 0
            if (retcode !== RetcodeEnum.RET_SUCC)
              return reject(translate("message.tools.autoPatch.error.queryFail", RetcodeEnum[retcode]))

            logger.debug("message.tools.autoPatch.debug.write", binFilePath)
            writeFileSync(binFilePath, buf)
            resolve()
          } catch (err) {
            reject(err)
          }
        })
      }
    ).on("error", (err) => reject(translate("message.tools.autoPatch.error.reqFail", ip, host, err.message)))
  })
}

export const checkForUpdate = async (): Promise<boolean> => {
  if (existsSync(binFilePath)) return true

  return update()
}

export const update = async (): Promise<boolean> => {
  try {
    if (!(await fileExists(protoPath))) throw new TError("message.tools.autoPatch.error.noProto")

    const r = new Resolver()

    r.setServers(config.dns.nameservers)

    const ip = (await r.resolve4(host))?.[0]
    logger.debug("message.tools.autoPatch.debug.resolve", "QueryRegionList", ip)

    await query(ip)

    return true
  } catch (err) {
    logger.error("generic.param1", err)
    return false
  }
}

export default {
  checkForUpdate,
  update,
}
