import GlobalState from '@/globalState'
import Handler, { HttpRequest, HttpResponse } from '#/handler'

class HandlerTemplateHandler extends Handler {
  constructor() {
    super('HandlerTemplate.com', '/HandlerTemplate')
  }

  async request(req: HttpRequest, globalState: GlobalState): Promise<HttpResponse> {
    return new HttpResponse()
  }
}

let handler: HandlerTemplateHandler
export default (() => handler = handler || new HandlerTemplateHandler())()