import Handler, { HttpRequest, HttpResponse } from '#/handler'
import { fileExists, readFile } from '@/utils/fileSystem'
import { join } from 'path'
import { cwd } from 'process'

class WebstaticSeaHandler extends Handler {
  constructor() {
    super(/^webstatic.*?\./, /^\/.*$/)
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const { host, pathname } = req.url

    const reqPath = decodeURIComponent(pathname)

    const fsDir = join(cwd(), 'webstaticSea')
    const pathList = [
      join(fsDir, reqPath),
      join(fsDir, reqPath, 'index.html')
    ]

    const isPkg = __filename.indexOf('index.js') !== -1

    if (isPkg) {
      const pkgDir = join(__dirname, '../webstaticSea')
      pathList.unshift(
        join(pkgDir, reqPath),
        join(pkgDir, reqPath, 'index.html')
      )
    }

    let filePath: string
    for (const path of pathList) {
      if (!await fileExists(path)) continue
      filePath = path
    }

    const header = {
      'Access-Control-Allow-Origin': '*'
    }

    let rsp: HttpResponse
    if (filePath == null) {
      rsp = new HttpResponse(`<?xml version="1.0" encoding="UTF-8"?><Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><RequestId>000000000000000000000000</RequestId><HostId>${host}</HostId><Key>${pathname.slice(1)}</Key></Error>`, 404, header)
      rsp.type = 'application/xml'
      return rsp
    } else {
      rsp = new HttpResponse(await readFile(filePath), 200, header)
      rsp.type = this.getMimeType(filePath.split('.').slice(-1)[0])
    }

    return rsp
  }

  private getMimeType(ext: string) {
    switch (ext) {
      case 'css':
        return 'text/css; charset=UTF-8'
      case 'html':
        return 'text/html; charset=UTF-8'
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg'
      case 'js':
        return 'text/javascript; charset=UTF-8'
      case 'png':
        return 'image/png'
      case 'webp':
        return 'image/webp'
      default:
        return null
    }
  }
}

let handler: WebstaticSeaHandler
export default (() => handler = handler || new WebstaticSeaHandler())()