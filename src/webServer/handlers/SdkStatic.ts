import Handler, { HttpRequest, HttpResponse } from "#/handler"

class SdkStaticHandler extends Handler {
  constructor() {
    super(/(sdk-.*?static|api-beta-sdk.*?)\./, [
      "/combo/box/api/config/sdk/combo",
      "/combo/box/api/config/sw/precache",
      /\/hk4e_.*?\/mdk\/shield\/api\/loadConfig/,
      /\/hk4e_.*?\/combo\/granter\/api\/getConfig/,
    ])
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const path = req.url.pathname.split("/").slice(-1)[0]
    switch (path) {
      case "combo":
        return this.sdkCombo(req)
      case "precache":
        return this.swPrecache(req)
      case "loadConfig":
        return this.loadConfig(req)
      case "getConfig":
        return this.getConfig(req)
      default:
        return new HttpResponse("404 page not found", 404)
    }
  }

  private async sdkCombo(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: "OK",
      data: {
        vals: {
          email_bind_remind: "true",
          disable_email_bind_skip: "false",
          email_bind_remind_interval: "7",
        },
      },
    })
  }

  private async swPrecache(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: "OK",
      data: {
        vals: {
          url: "https://webstatic-sea.hoyoverse.com/sw.html",
          enable: "true",
        },
      },
    })
  }

  private async loadConfig(req: HttpRequest): Promise<HttpResponse> {
    const { searchParams } = req

    return new HttpResponse({
      retcode: 0,
      message: "OK",
      data: {
        id: 6,
        game_key: searchParams.get("game_key"),
        client: searchParams.get("client"),
        identity: "I_IDENTITY",
        guest: false,
        ignore_versions: "",
        scene: "S_NORMAL",
        name: "原神海外",
        disable_regist: false,
        enable_email_captcha: false,
        thirdparty: ["fb", "tw"],
        disable_mmt: false,
        server_guest: false,
        thirdparty_ignore: { fb: "", tw: "" },
        enable_ps_bind_account: false,
        thirdparty_login_configs: {
          fb: { token_type: "TK_GAME_TOKEN", game_token_expires_in: 604800 },
          tw: { token_type: "TK_GAME_TOKEN", game_token_expires_in: 604800 },
        },
      },
    })
  }

  private async getConfig(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: "OK",
      data: {
        protocol: true,
        qr_enabled: false,
        log_level: "INFO",
        announce_url:
          "https://webstatic-sea.mihoyo.com/hk4e/announcement/index.html?sdk_presentation_style=fullscreen\u0026sdk_screen_transparent=true\u0026game_biz=hk4e_global\u0026auth_appid=announcement\u0026game=hk4e#/",
        push_alias_type: 2,
        disable_ysdk_guard: false,
        enable_announce_pic_popup: true,
      },
    })
  }
}

let handler: SdkStaticHandler
export default (() => (handler = handler || new SdkStaticHandler()))()
