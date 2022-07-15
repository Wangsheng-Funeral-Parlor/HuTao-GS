import Handler, { HttpRequest, HttpResponse } from '#/handler'
import config from '@/config'
import GlobalState from '@/globalState'
import curRegion from '@/tools/update/curRegion'
import regionList from '@/tools/update/regionList'
import { QueryCurrRegionHttpRsp } from '@/types/dispatch/curRegion'
import { QueryRegionListHttpRsp } from '@/types/dispatch/regionList'
import { RetcodeEnum } from '@/types/enum/retcode'
import DispatchKey from '@/utils/dispatchKey'
import { fileExists, readFile } from '@/utils/fileSystem'
import { rsaEncrypt, rsaSign } from '@/utils/rsa'
import { join } from 'path'
import { cwd } from 'process'
import * as protobuf from 'protobufjs'

class DispatchHandler extends Handler {
  keyMap: {
    [id: number]: {
      encrypt: string
      signing: string
    }
  }

  constructor() {
    super(
      [
        /.*?dispatch.*?\./,
        /^(?:\d{1,3}\.){3}\d{1,3}$/
      ],
      [
        '/query_cur_region',
        '/query_region_list',
        '/query_security_file',
        '/dispatch/dispatch/getGateAddress'
      ]
    )

    this.keyMap = {}
  }

  async request(req: HttpRequest, _globalState: GlobalState): Promise<HttpResponse> {
    const path = req.url.pathname.split('/').slice(-1)[0]
    switch (path) {
      case 'query_cur_region':
        return this.queryCurRegion(req)
      case 'query_region_list':
        return this.queryRegionList(req)
      case 'getGateAddress':
        return this.getGateAddress(req)
      default:
        return new HttpResponse('404 page not found', 404)
    }
  }

  private async queryCurRegion(req: HttpRequest): Promise<HttpResponse> {
    if (!await curRegion.checkForUpdate()) throw new Error('Update failed')

    const protoPath = join(cwd(), `data/proto/QueryCurrRegionHttpRsp.proto`)
    const binPath = join(cwd(), `data/bin/${config.version}/QueryCurrRegionHttpRsp.bin`)

    if (!await fileExists(protoPath)) throw new Error('Missing proto file.')
    if (!await fileExists(binPath)) throw new Error('Missing bin file.')

    const { searchParams } = req
    const version = (searchParams.get('version')?.match(/[\d\.]+/)?.[0] || '0')
      .split('.')
      .map((n, i, arr) => (parseInt(n) & 0xFF) << (8 * ((arr.length - 1) - i)))
      .reduce((sum, v) => sum + v, 0)

    const root = await protobuf.load(protoPath)
    const type = root.lookupType('QueryCurrRegionHttpRsp')
    const message = type.decode(await readFile(binPath))

    let response: any
    let curRegionRsp: QueryCurrRegionHttpRsp

    switch (true) {
      case version >= 0x020732: { // >= 2.7.50
        const keyId = parseInt(searchParams.get('key_id')) || 0
        const keyPairs = await DispatchKey.getKeyPairs(keyId)

        curRegionRsp = <QueryCurrRegionHttpRsp>message.toJSON()

        curRegionRsp.regionInfo.gateserverIp = config.hostIp
        curRegionRsp.regionInfo.gateserverPort = 22102
        curRegionRsp.regionInfo.payCallbackUrl = `https://${config.hostIp}/recharge`

        const encoded = this.encodeProto(type, curRegionRsp)

        response = {
          content: rsaEncrypt(keyPairs.encrypt.public.pem, encoded).toString('base64'),
          sign: rsaSign(keyPairs.signing.private.pem, encoded).toString('base64')
        }
        break
      }
      case version >= 0x010000: { // >= 1.0.0
        curRegionRsp = <QueryCurrRegionHttpRsp>message.toJSON()

        curRegionRsp.regionInfo.gateserverIp = config.hostIp
        curRegionRsp.regionInfo.gateserverPort = 22102
        curRegionRsp.regionInfo.payCallbackUrl = `https://${config.hostIp}/recharge`

        response = this.encodeProto(type, curRegionRsp).toString('base64')
        break
      }
      default: {
        curRegionRsp = {
          retcode: RetcodeEnum.RET_SVR_ERROR,
          msg: 'Not Found version config'
        }

        response = this.encodeProto(type, curRegionRsp).toString('base64')
      }
    }

    return new HttpResponse(response)
  }

  private async queryRegionList(_req: HttpRequest): Promise<HttpResponse> {
    if (!regionList.checkForUpdate()) throw new Error('Update failed')

    const protoPath = join(cwd(), `data/proto/QueryRegionListHttpRsp.proto`)
    const binPath = join(cwd(), `data/bin/${config.version}/QueryRegionListHttpRsp.bin`)

    if (!await fileExists(protoPath)) throw new Error('Missing proto file.')
    if (!await fileExists(binPath)) throw new Error('Missing bin file.')

    const root = await protobuf.load(protoPath)
    const type = root.lookupType('QueryRegionListHttpRsp')
    const message = type.decode(await readFile(binPath))
    const regionListRsp: QueryRegionListHttpRsp = <QueryRegionListHttpRsp>message.toJSON()
    const dispatchHost = config.dispatchHost || config.hostIp

    for (let region of regionListRsp.regionList) {
      region.title = config.serverName
      region.dispatchUrl = `https://${dispatchHost}/query_cur_region`
    }

    return new HttpResponse(this.encodeProto(type, regionListRsp).toString('base64'))
  }

  private async getGateAddress(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        address_list: []
      }
    })
  }

  private encodeProto(type: protobuf.Type, obj: any): Buffer {
    const newMessage = type.create(obj)
    return Buffer.from(type.encode(newMessage).finish())
  }
}

let handler: DispatchHandler
export default (() => handler = handler || new DispatchHandler())()