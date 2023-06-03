import Handler, { HttpRequest, HttpResponse } from "#/handler"

class AccountHandler extends Handler {
  constructor() {
    super(/^(account|user)\./, ["/pcSdkLogin.html", "/geetestV2.html"])
  }

  async request(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse("<html></html>")
  }
}

let handler: AccountHandler
export default (() => (handler = handler || new AccountHandler()))()
