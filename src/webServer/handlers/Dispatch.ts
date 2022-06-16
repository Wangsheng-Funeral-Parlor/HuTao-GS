import fs from 'fs'
const { readFile } = fs.promises
import { join } from 'path'
import { cwd } from 'process'
import * as protobuf from 'protobufjs'
import GlobalState from '@/globalState'
import curRegion from '@/update/curRegion'
import Handler, { HttpRequest, HttpResponse } from '#/handler'
import { QueryCurrRegionHttpRsp } from '@/types/dispatch/curRegion'
import { RetcodeEnum } from '@/types/enum/retcode'
import regionList from '@/update/regionList'
import { QueryRegionListHttpRsp } from '@/types/dispatch/regionList'
import { fileExists } from '@/utils/fileSystem'
import config from '@/config'

class DispatchHandler extends Handler {
  constructor() {
    super(
      [
        /.*?dispatch.*?\./,
        /^(?:\d{1,3}\.){3}\d{1,3}$/
      ], [
      '/query_cur_region',
      '/query_region_list',
      '/query_security_file',
      '/dispatch/dispatch/getGateAddress'
    ]
    )
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

    const root = await protobuf.load(protoPath)
    const type = root.lookupType('QueryCurrRegionHttpRsp')
    const message = type.decode(await readFile(binPath))
    let curRegionRsp: QueryCurrRegionHttpRsp

    if (req.searchParams.has('version')) {
      curRegionRsp = <QueryCurrRegionHttpRsp>message.toJSON()

      curRegionRsp.regionInfo.gateserverIp = config.hostIp
      curRegionRsp.regionInfo.gateserverPort = 22102
      curRegionRsp.regionInfo.payCallbackUrl = `https://${config.hostIp}/recharge`
    } else {
      curRegionRsp = {
        retcode: RetcodeEnum.RET_SVR_ERROR,
        msg: 'Not Found version config'
      }
    }

    const newMessage = type.create(curRegionRsp)
    const encoded = type.encode(newMessage).finish()

    return new HttpResponse(Buffer.from(encoded).toString('base64'))
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

    const newMessage = type.create(regionListRsp)
    const encoded = type.encode(newMessage).finish()

    return new HttpResponse(Buffer.from(encoded).toString('base64'))
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
}

let handler: DispatchHandler
export default (() => handler = handler || new DispatchHandler())()