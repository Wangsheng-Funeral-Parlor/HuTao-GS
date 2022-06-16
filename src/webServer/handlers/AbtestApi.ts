import GlobalState from '@/globalState'
import Handler, { HttpRequest, HttpResponse } from '#/handler'
import { RetcodeEnum } from '@/types/enum/retcode'

class AbtestApiHandler extends Handler {
  constructor() {
    super(/^abtest\-api.*?\./, [
      '/data_abtest_api/config/experiment/list'
    ])
  }

  async request(_req: HttpRequest, _globalState: GlobalState): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: RetcodeEnum.RET_SUCC,
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