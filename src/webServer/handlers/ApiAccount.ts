import Handler, { HttpRequest, HttpResponse } from '#/handler'

class ApiAccountHandler extends Handler {
  constructor() {
    super(/^(.*?api-account.*?|api.*?-takumi)\./, [
      '/account/risky/api/check'
    ])
  }

  async request(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        id: 'none',
        action: 'ACTION_NONE',
        geetest: null
      }
    })
  }
}

let handler: ApiAccountHandler
export default (() => handler = handler || new ApiAccountHandler())()