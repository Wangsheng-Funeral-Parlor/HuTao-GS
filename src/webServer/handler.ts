import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http'
import WebServer from '.'

export type MatchRule = string | RegExp | (string | RegExp)[]

export class HttpRequest {
  webServer: WebServer

  req: IncomingMessage

  url: URL
  headers: IncomingHttpHeaders
  body: any

  constructor(webServer: WebServer, req: IncomingMessage) {
    this.webServer = webServer

    this.req = req

    const { url, headers } = req
    const { host } = headers

    this.url = new URL(url, `https://${host ? host.replace(/:.*/g, '') : 'unknown'}`)
    this.headers = headers
  }

  get searchParams() {
    return this.url.searchParams
  }

  waitBody(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const { req } = this

      this.body = ''

      if (req.method !== 'POST') return resolve()

      req.on('error', reject)
      req.on('end', () => {
        try { this.body = JSON.parse(this.body) } catch (err) { }
        resolve()
      })
      req.on('data', (chunk: string) => this.body += chunk)
    })
  }
}

export class HttpResponse {
  code: number
  type?: string
  data?: any
  headers?: { [header: string]: string }

  constructor(data?: any, code: number = 200, headers?: { [header: string]: string }) {
    this.code = code
    this.data = data
    this.headers = headers
  }

  sendResponse(rsp: ServerResponse) {
    const { code, headers } = this
    let { type, data } = this

    const isBuffer = Buffer.isBuffer(data)

    if (!isBuffer && typeof data === 'object') {
      type = 'application/json'
      data = JSON.stringify(data)
    }

    if (!rsp.headersSent) {
      if (type != null) rsp.setHeader('Content-Type', type)
      rsp.setHeader('Content-Length', (isBuffer ? data : Buffer.from(data)).length)
      rsp.setHeader('Cache-Control', 'no-store')

      if (headers != null) {
        for (const header in headers) rsp.setHeader(header, headers[header])
      }
    }

    rsp.writeHead(code)
    rsp.end(data)
  }
}

export default class Handler {
  domainList?: (string | RegExp)[]
  pathList?: (string | RegExp)[]

  verbose: boolean

  constructor(domain?: MatchRule, path?: MatchRule, verbose?: boolean) {
    this.domainList = Array.isArray(domain) ? domain : [domain || null]
    this.pathList = Array.isArray(path) ? path : [path || null]

    this.verbose = !!verbose
  }

  matchUrl(url: URL) {
    const { domainList, pathList } = this
    const { host, pathname } = url

    // Test host
    if (domainList.find(domain => typeof domain === 'string' ? host === domain : host.match(domain) != null) == null) return false

    // Test path
    if (pathList.find(path => typeof path === 'string' ? pathname === path : pathname.match(path) != null) == null) return false

    return true
  }

  async request(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse()
  }
}