import Handler, { HttpRequest, HttpResponse } from '#/handler'
import GlobalState from '@/globalState'

class ApiAccountHandler extends Handler {
  constructor() {
    super(/.*?api-account.*?\./, [
      '/account/risky/api/check'
    ])
  }

  async request(_req: HttpRequest, _globalState: GlobalState): Promise<HttpResponse> {
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