import Handler, { HttpRequest, HttpResponse } from '#/handler'

class {{name}}eHandler extends Handler {
  constructor() {
    super('{{name}}.com', '/{{name}}')
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse()
  }
}

let handler: {{name}}Handler
export default (() => handler = handler || new {{name}}Handler())()