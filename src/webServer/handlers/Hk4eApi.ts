import Handler, { HttpRequest, HttpResponse } from '#/handler'
import { Announcement, AnnouncementType } from '@/types/announcement'
import { getTimeSeconds, getTimestamp } from '@/utils/time'

const CORSHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,gameName,Channel,DS',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE',
  'Access-Control-Allow-Origin': '*'
}

class Hk4eApiHandler extends Handler {
  lastExchange: { [key: string]: number }

  constructor() {
    super(/.*?hk4e-api.*?\./, [
      '/common/apicdkey/api/exchangeCdkey',
      /\/common\/hk4e_.*?\/announcement\/api\/getAlertAnn/,
      /\/common\/hk4e_.*?\/announcement\/api\/getAlertPic/,
      /\/common\/hk4e_.*?\/announcement\/api\/getAnnContent/,
      /\/common\/hk4e_.*?\/announcement\/api\/getAnnList/
    ])
  }

  private getCORSHeaders(req: HttpRequest) {
    return Object.assign({}, CORSHeaders, {
      'Access-Control-Allow-Origin': req.headers.origin || '*'
    })
  }

  private getAnnListItem(types: AnnouncementType[], announcement: Announcement, id: number) {
    const { type, subtitle, title, banner, content, tag, loginAlert, start, end } = announcement
    return {
      alert: 0,
      ann_id: id,
      banner,
      content: '',
      end_time: getTimestamp(end),
      extra_remind: 0,
      has_content: content.length > 0,
      lang: 'en-us',
      login_alert: Number(loginAlert),
      remind: 0,
      remind_ver: 1,
      start_time: getTimestamp(start),
      subtitle,
      tag_end_time: getTimestamp(end),
      tag_icon: `https://webstatic-sea.mihoyo.com/hk4e/announcement/img/tag${tag}.png`,
      tag_label: tag,
      tag_start_time: getTimestamp(start),
      title,
      type,
      type_label: types.find(t => t.id === type)?.mi18nName
    }
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const path = req.url.pathname.split('/').slice(-1)[0]
    switch (path) {
      case 'exchangeCdkey':
        return this.exchangeCdkey(req)
      case 'getAlertAnn':
        return this.getAlertAnn(req)
      case 'getAlertPic':
        return this.getAlertPic(req)
      case 'getAnnContent':
        return this.getAnnContent(req)
      case 'getAnnList':
        return this.getAnnList(req)
      default:
        return new HttpResponse('404 page not found', 404, this.getCORSHeaders(req))
    }
  }

  private async exchangeCdkey(req: HttpRequest): Promise<HttpResponse> {
    //?sign_type=2&auth_appid=apicdkey&authkey_ver=1&cdkey=ABCDEFGHIJKL&lang=zh-tw&device_type=pc&ext=%7B%22loc%22%3A%7B%22x%22%3A0%2C%22y%22%3A0%2C%22z%22%3A0%7D%2C%22platform%22%3A%22WinST%22%7D&game_version=OSRELWin2.6.0_R6708157_S7320343_D6731353&plat_type=pc&authkey=??&game_biz=hk4e_global
    const searchParams = req.searchParams
    const authkey = searchParams.get('authkey') || '-'
    const lastExchange = this.lastExchange[authkey] || 0

    let retcode = 0
    let message = 'OK'

    if (!searchParams.has('cdkey') || searchParams.get('cdkey').length !== 12) {
      retcode = -2003
      message = '無效的兌換碼'
    } else if (Date.now() - lastExchange < 5e3) {
      retcode = -2016
      message = `兌換冷卻中\uff0c請${5 - Math.ceil((Date.now() - lastExchange) / 1e3)}秒後再試`
    } else {
      this.lastExchange[authkey] = Date.now()
    }

    return new HttpResponse({
      retcode,
      message,
      data: retcode === 0 ? { msg: '兌換成功', special_shipping: 0 } : null
    }, undefined, this.getCORSHeaders(req))
  }

  private async getAlertAnn(req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        alert: false,
        alert_id: 0,
        remind: false,
        extra_remind: false
      }
    }, undefined, this.getCORSHeaders(req))
  }

  private async getAlertPic(req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        list: [],
        total: 0
      }
    }, undefined, this.getCORSHeaders(req))
  }

  private async getAnnContent(req: HttpRequest): Promise<HttpResponse> {
    const { announcements } = req.webServer

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        list: announcements.map((a, i) => ({
          ann_id: i,
          banner: a.banner,
          content: a.content,
          lang: 'en-us',
          subtitle: a.subtitle,
          title: a.title
        })),
        pic_list: [],
        pic_total: 0,
        total: announcements.length
      }
    }, undefined, this.getCORSHeaders(req))
  }

  private async getAnnList(req: HttpRequest): Promise<HttpResponse> {
    const { announcementTypes, announcements } = req.webServer

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        alert: false,
        alert_id: 0,
        list: announcementTypes.map(t => ({
          list: announcements.filter(a => a.type === t.id).map((a, i) => this.getAnnListItem(announcementTypes, a, i)),
          type_id: t.id,
          type_label: t.mi18nName
        })),
        pic_alert: false,
        pic_alert_id: 0,
        pic_list: [],
        pic_total: 0,
        pic_type_list: [],
        static_sign: '',
        t: getTimeSeconds().toString(),
        timezone: 1,
        total: announcements.length,
        type_list: announcementTypes.map(t => ({
          id: t.id,
          mi18n_name: t.mi18nName,
          name: t.name
        }))
      }
    }, undefined, this.getCORSHeaders(req))
  }
}

let handler: Hk4eApiHandler
export default (() => handler = handler || new Hk4eApiHandler())()