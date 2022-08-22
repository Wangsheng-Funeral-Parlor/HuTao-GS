import config from '@/config'
import Logger from '@/logger'
import { QueryRegionListHttpRsp } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'
import { fileExists } from '@/utils/fileSystem'
import { dataToProtobuffer } from '@/utils/proto'
import * as dns from 'dns'
import { existsSync, writeFileSync } from 'fs'
import { get } from 'https'
import { join } from 'path'
import { cwd } from 'process'
const { Resolver } = dns.promises

const host = `dispatch${config.dispatchRegion.slice(0, 2).toLowerCase()}global.yuanshen.com`
const protoPath = join(cwd(), `data/proto/QueryRegionListHttpRsp.proto`)
const binFilePath = join(cwd(), `data/bin/${config.version}/QueryRegionListHttpRsp.bin`)

const logger = new Logger('APATCH')

function query(ip: string) {
  return new Promise<void>((resolve, reject) => {
    const path = `/query_region_list?version=${config.dispatchRegion}Win${config.version}&lang=3&platform=3&binary=1&time=543&channel_id=1&sub_channel_id=0`
    logger.debug('(QueryRegionList) Host:', host, 'Path:', path)
    get(`https://${ip}${path}`, {
      headers: {
        'Host': host,
        'User-Agent': 'UnityPlayer/2017.4.30f1 (UnityWebRequest/1.0, libcurl/7.51.0-DEV)',
        'Accept': '*/*',
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Unity-Version': '2017.4.30f1'
      }
    }, res => {
      const { statusCode } = res
      if (statusCode !== 200) {
        // Consume response data to free up memory
        res.resume()

        return reject(`HTTP ${statusCode}`)
      }

      let data = ''

      res.setEncoding('utf8')
      res.on('error', err => reject(`IP: ${ip} Host: ${host} Error: ${err.message}`))
      res.on('data', chunk => data += chunk)
      res.on('end', async () => {
        try {
          const buf = Buffer.from(data, 'base64')
          const regionListRsp = <QueryRegionListHttpRsp>await dataToProtobuffer(buf, 'QueryRegionListHttpRsp', true)

          const retcode = regionListRsp.retcode || 0
          if (retcode !== RetcodeEnum.RET_SUCC) return reject(`Query failed: ${RetcodeEnum[retcode]}`)

          logger.debug('Writing to:', binFilePath)
          writeFileSync(binFilePath, buf)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }).on('error', err => reject(`IP: ${ip} Host: ${host} Error: ${err.message}`))
  })
}

export const checkForUpdate = async (): Promise<boolean> => {
  if (existsSync(binFilePath)) return true

  return update()
}

export const update = async (): Promise<boolean> => {
  try {
    if (!await fileExists(protoPath)) throw new Error('Missing proto file.')

    const r = new Resolver()

    r.setServers(config.nameservers)

    const ip = (await r.resolve4(host))?.[0]
    logger.debug('(QueryRegionList) Resolved:', ip)

    await query(ip)

    return true
  } catch (err) {
    logger.error(err)
    return false
  }
}

export default {
  checkForUpdate,
  update
}