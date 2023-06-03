import * as http from "http"
import * as https from "https"
import { AddressInfo } from "net"

import EventEmitter from "promise-events"

import Handler, { HttpRequest, HttpResponse } from "./handler"
import AbtestApi from "./handlers/AbtestApi"
import Account from "./handlers/Account"
import ApiAccount from "./handlers/ApiAccount"
import Dispatch from "./handlers/Dispatch"
import Hk4eApi from "./handlers/Hk4eApi"
import Hk4eSdk from "./handlers/Hk4eSdk"
import LogRecorder from "./handlers/LogRecorder"
import MinorApi from "./handlers/MinorApi"
import Report from "./handlers/Report"
import SdkStatic from "./handlers/SdkStatic"
import Update from "./handlers/Update"
import WebstaticSea from "./handlers/WebstaticSea"
import SSL from "./ssl"

import Server from "@/server"
import TLogger from "@/translate/tlogger"
import { cRGB } from "@/tty/utils"
import { Announcement, AnnouncementType } from "@/types/announcement"

const logger = new TLogger("WEBSRV", 0x00ff00)

export interface ServerConfig {
  port: number
  useHttps?: boolean
}

export default class WebServer extends EventEmitter {
  server: Server

  servers: (http.Server | https.Server)[]
  handlers: Handler[]
  ssl: SSL

  announcementTypes: AnnouncementType[]
  announcements: Announcement[]

  constructor(server: Server) {
    super()

    this.server = server

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
      Update,
      Account,
      WebstaticSea,
    ]

    this.ssl = new SSL()

    this.announcementTypes = [
      {
        id: 2,
        mi18nName: "Game",
        name: "游戏系统公告",
      },
      {
        id: 1,
        mi18nName: "Event",
        name: "活动公告",
      },
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
      logger.error("message.webServer.error.noSSL")
      return
    }

    for (const serverConfig of configs) {
      const { port, useHttps } = serverConfig

      let server: http.Server | https.Server

      if (useHttps) server = https.createServer(httpsConfig, requestListener)
      else server = http.createServer(requestListener)

      total++

      server.on("checkContinue", requestListener)
      server.on("error", (err) => logger.error("generic.param1", err))

      server.listen(port, () => {
        logger.info("message.webServer.info.listen", cRGB(0xffffff, (<AddressInfo>server.address()).port.toString()))
        if (++listening >= total) this.emit("listening")
      })

      servers.push(server)
    }
  }

  stop(): void {
    for (const server of this.servers) server.close()
  }

  async requestListener(req: http.IncomingMessage, rsp: http.ServerResponse): Promise<void> {
    const { handlers } = this

    try {
      const request = new HttpRequest(this, req)
      await request.waitBody()

      const { url, searchParams } = request
      const { host, pathname } = url
      const fullUrl = host + pathname + "?" + searchParams

      let response: HttpResponse
      let isVerbose = false
      for (const handler of handlers) {
        if (!handler.matchUrl(url)) continue

        response = await handler.request(request)
        isVerbose = handler.verbose
        break
      }

      if (response != null) {
        logger[isVerbose ? "verbose" : "debug"]("message.webServer.debug.handle", response.code, fullUrl)
        response.sendResponse(rsp)
        return
      }

      logger.debug("message.webServer.debug.noHandler", fullUrl)

      rsp.writeHead(404)
      rsp.end("404")
      return
    } catch (err) {
      if (err?.message !== "aborted") logger.error("message.webServer.error.handler", err)

      rsp.writeHead(500)
      rsp.end("500")
    }
  }
}
