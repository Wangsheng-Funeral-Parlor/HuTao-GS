import config from '@/config'
import translate from '@/translate'
import TError from '@/translate/terror'
import TLogger from '@/translate/tlogger'
import { QueryCurrRegionHttpRsp } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'
import DispatchKey from '@/utils/dispatchKey'
import { fileExists } from '@/utils/fileSystem'
import { dataToProtobuffer } from '@/utils/proto'
import { rsaDecrypt } from '@/utils/rsa'
import * as dns from 'dns'
import { existsSync, writeFileSync } from 'fs'
import { get } from 'https'
import { join } from 'path'
import { cwd } from 'process'
const { Resolver } = dns.promises

const { version, nameservers, dispatchRegion, dispatchSeed, dispatchKeyId } = config
const hostMap = {
  'OSREL': 'osasiadispatch',
  'CNCB': 'cnbeta01dispatch'
}

const host = `${hostMap[dispatchRegion]}.yuanshen.com`
const protoPath = join(cwd(), `data/proto/QueryCurrRegionHttpRsp.proto`)
const binFilePath = join(cwd(), `data/bin/${version}/QueryCurrRegionHttpRsp.bin`)

const logger = new TLogger('APATCH')

async function decryptResponse(keyId: number, data: string): Promise<string> {
  if (keyId == null || data?.[0] !== '{') return data

  try {
    const response = JSON.parse(data)
    const clientKeyPair = await DispatchKey.getClientKeyPair(keyId)

    return rsaDecrypt(
      clientKeyPair.private,
      Buffer.from(response.content, 'base64')
    ).toString('base64')
  } catch (err) {
    logger.error('generic.param1', err)
    return data
  }
}

function query(ip: string, overrideSeed?: string) {
  const keyId = dispatchKeyId ? `&key_id=${dispatchKeyId}` : ''

  return new Promise<void>((resolve, reject) => {
    const path = `/query_cur_region?version=${dispatchRegion}Win${version}&lang=3&platform=3&binary=1&time=38&channel_id=1&sub_channel_id=0&account_type=1&dispatchSeed=${overrideSeed == null ? dispatchSeed : overrideSeed}${keyId}`
    logger.debug('message.tools.autoPatch.debug.reqInfo', 'QueryCurrRegion', host, path)
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
      res.on('error', err => reject(translate('message.tools.autoPatch.error.reqFail', ip, host, err.message)))
      res.on('data', chunk => data += chunk)
      res.on('end', async () => {
        try {
          const buf = Buffer.from(await decryptResponse(dispatchKeyId, data), 'base64')
          const curRegionRsp = await dataToProtobuffer<QueryCurrRegionHttpRsp>(buf, 'QueryCurrRegionHttpRsp', true)

          const retcode = curRegionRsp.retcode || 0
          if (retcode !== RetcodeEnum.RET_SUCC) return reject(translate('message.tools.autoPatch.error.queryFail', RetcodeEnum[retcode]))

          logger.debug('message.tools.autoPatch.debug.write', binFilePath)
          writeFileSync(binFilePath, buf)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }).on('error', err => reject(translate('message.tools.autoPatch.error.reqFail', ip, host, err.message)))
  })
}

export const checkForUpdate = async (overrideSeed?: string): Promise<boolean> => {
  if (existsSync(binFilePath)) return true

  return update(overrideSeed)
}

export const update = async (overrideSeed?: string): Promise<boolean> => {
  try {
    if (hostMap[dispatchRegion] == null) throw new TError('message.tools.autoPatch.error.invalidRegion')
    if (!await fileExists(protoPath)) throw new TError('message.tools.autoPatch.error.noProto')
    if (dispatchSeed == null && overrideSeed == null) throw new TError('message.tools.autoPatch.error.noSeed')

    const r = new Resolver()

    r.setServers(nameservers)

    const ip = (await r.resolve4(host))?.[0]
    logger.debug('message.tools.autoPatch.debug.resolve', 'QueryCurrRegion', ip)

    await query(ip, overrideSeed)

    return true
  } catch (err) {
    logger.error('generic.param1', err)
    return false
  }
}

export default {
  checkForUpdate,
  update
}