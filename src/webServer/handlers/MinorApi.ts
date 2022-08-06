import GlobalState from '@/globalState'
import Handler, { HttpRequest, HttpResponse } from '#/handler'

class MinorApiHandler extends Handler {
  constructor() {
    super(/^minor-api.*?\./, '/common/h5log/log/batch', true)
  }

  async request(_req: HttpRequest, _globalState: GlobalState): Promise<HttpResponse> {
    return new HttpResponse('')
  }
}

let handler: MinorApiHandler
export default (() => handler = handler || new MinorApiHandler())()