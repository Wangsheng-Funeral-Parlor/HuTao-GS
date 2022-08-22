import Handler, { HttpRequest, HttpResponse } from '#/handler'

class AbtestApiHandler extends Handler {
  constructor() {
    super(/^abtest-api.*?\./, [
      '/data_abtest_api/config/experiment/list'
    ])
  }

  async request(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      success: true,
      message: '',
      data: [{
        code: 1000,
        type: 2,
        config_id: '14',
        period_id: '6036_99',
        version: '1',
        configs: {
          cardType: 'old'
        }
      }]
    })
  }
}

let handler: AbtestApiHandler
export default (() => handler = handler || new AbtestApiHandler())()