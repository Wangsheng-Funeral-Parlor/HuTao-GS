import { existsSync, writeFileSync } from 'fs'
import { get } from 'https'
import { join } from 'path'
import { cwd } from 'process'
import * as dns from 'dns'
const { Resolver } = dns.promises
import Logger from '@/logger'
import config from '@/config'

const host = 'osasiadispatch.yuanshen.com'
const binFilePath = join(cwd(), `data/bin/${config.version}/QueryCurrRegionHttpRsp.bin`)

const logger = new Logger('UPDATE')

export const checkForUpdate = async (): Promise<boolean> => {
  if (existsSync(binFilePath)) return true

  return update()
}

export const update = async (): Promise<boolean> => {
  try {
    const r = new Resolver()

    r.setServers(config.nameservers)

    const ip = await r.resolve4(host)

    await new Promise<void>((resolve, reject) => {
      logger.debug('(QueryCurrRegion) Resolved:', ip)

      if (config.dispatchSeed == null) return reject('Missing dispatch seed.')

      get(`https://${ip}/query_cur_region?version=OSRELWin${config.version}&lang=3&platform=3&binary=1&time=38&channel_id=1&sub_channel_id=0&account_type=1&dispatchSeed=${config.dispatchSeed}`, {
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
        res.on('end', () => {
          try {
            logger.debug('Writing to:', binFilePath)
            writeFileSync(binFilePath, Buffer.from(data, 'base64'))
            resolve()
          } catch (err) {
            reject(err)
          }
        })
      }).on('error', err => reject(`IP: ${ip} Host: ${host} Error: ${err.message}`))
    })

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