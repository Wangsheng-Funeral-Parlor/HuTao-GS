import * as http from 'http'
import * as https from 'https'
import { AddressInfo } from 'net'
import Logger from '@/logger'
import EventEmitter from 'promise-events'
import { cRGB } from '@/tty'
import SSL from './ssl'
import Handler, { HttpRequest, HttpResponse } from './handler'
import LogRecorder from './handlers/LogRecorder'
import Report from './handlers/Report'
import GlobalState from '@/globalState'
import Dispatch from './handlers/Dispatch'
import WebstaticSea from './handlers/WebstaticSea'
import SdkStatic from './handlers/SdkStatic'
import Hk4eSdk from './handlers/Hk4eSdk'
import Hk4eApi from './handlers/Hk4eApi'
import ApiAccount from './handlers/ApiAccount'
import AbtestApi from './handlers/AbtestApi'
import { Announcement, AnnouncementType } from '@/types/announcement'
import MinorApi from './handlers/MinorApi'

const logger = new Logger('WEBSRV', 0x00ff00)

export interface ServerConfig {
  port: number,
  useHttps?: boolean
}

export default class WebServer extends EventEmitter {
  globalState: GlobalState
  servers: (http.Server | https.Server)[]
  handlers: Handler[]
  ssl: SSL

  announcementTypes: AnnouncementType[]
  announcements: Announcement[]

  constructor(globalState: GlobalState) {
    super()

    this.globalState = globalState
    this.servers = []
    this.handlers = [
      LogRecorder,
      Report,
      MinorApi,
      Dispatch,
      Hk4eSdk,
      Hk4eApi,
      ApiAccount,
      AbtestApi,
      SdkStatic,
      WebstaticSea
    ]

    this.ssl = new SSL()

    this.announcementTypes = [
      {
        id: 2,
        mi18nName: 'Game',
        name: '游戏系统公告'
      },
      {
        id: 1,
        mi18nName: 'Event',
        name: '活动公告'
      }
    ]
    this.announcements = []

    this.requestListener = this.requestListener.bind(this)
  }

  async start(configs: ServerConfig[]): Promise<void> {
    const { ssl, servers, requestListener } = this

    let total = 0
    let listening = 0

    const httpsConfig = await ssl.exportHttpsConfig()
    if (httpsConfig == null) {
      logger.error('Unable to generate ssl config, abort.')
      return
    }

    for (const serverConfig of configs) {
      const { port, useHttps } = serverConfig

      let server: http.Server | https.Server

      if (useHttps) server = https.createServer(httpsConfig, requestListener)
      else server = http.createServer(requestListener)

      total++

      server.on('checkContinue', requestListener)
      server.on('error', err => logger.error(err))

      server.listen(port, () => {
        logger.debug(`Listening on port ${cRGB(0xffffff, (server.address() as AddressInfo).port.toString())}`)
        if (++listening >= total) this.emit('listening')
      })

      servers.push(server)
    }
  }

  stop(): void {
    for (const server of this.servers) server.close()
  }

  async requestListener(req: http.IncomingMessage, rsp: http.ServerResponse): Promise<void> {
    const { globalState, handlers } = this

    try {
      const request = new HttpRequest(this, req)
      await request.waitBody()

      const { url } = request
      const { host, pathname } = url
      const fullUrl = host + pathname

      let response: HttpResponse
      let isVerbose = false
      for (const handler of handlers) {
        if (!handler.matchUrl(url)) continue

        response = await handler.request(request, globalState)
        isVerbose = handler.verbose
        break
      }

      if (response != null) {
        logger[isVerbose ? 'verbose' : 'debug'](`Handled: (${response.code})${fullUrl}`)
        response.sendResponse(rsp)
        return
      }

      logger.debug(`Unhandled: ${fullUrl}`)

      rsp.writeHead(404)
      rsp.end('404')
      return
    } catch (err) {
      const errMsg = (<Error>err).message

      if (errMsg !== 'aborted') logger.error('Error handling request:', errMsg)

      rsp.writeHead(500)
      rsp.end('500')
    }
  }
}