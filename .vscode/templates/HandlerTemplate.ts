import Handler, { HttpRequest, HttpResponse } from '#/handler'

class HandlerTemplateHandler extends Handler {
  constructor() {
    super('HandlerTemplate.com', '/HandlerTemplate')
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse()
  }
}

let handler: HandlerTemplateHandler
export default (() => handler = handler || new HandlerTemplateHandler())()