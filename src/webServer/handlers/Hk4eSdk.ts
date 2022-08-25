import Handler, { HttpRequest, HttpResponse } from '#/handler'
import config from '@/config'
import UserData from '@/types/user'
import hash from '@/utils/hash'
import { getJson } from '@/utils/json'
import md5 from 'md5'
import priceTier from '../priceTier.json'

class Hk4eSdkHandler extends Handler {
  constructor() {
    super(/^(hk4e-sdk|hk4e-beta-sdk|api-beta-sdk).*?\./, [
      /\/hk4e_.*?\/combo\/granter\/api\/compareProtocolVersion/,
      /\/hk4e_.*?\/combo\/granter\/login\/beforeVerify/,
      /\/hk4e_.*?\/combo\/granter\/login\/v2\/login/,
      /\/hk4e_.*?\/mdk\/agreement\/api\/getAgreementInfos/,
      /\/hk4e_.*?\/mdk\/shield\/api\/login/,
      /\/hk4e_.*?\/mdk\/shield\/api\/verify/,
      /\/hk4e_.*?\/mdk\/shopwindow\/shopwindow\/listPriceTier/
    ])
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const path = req.url.pathname.split('/').slice(-1)[0]
    switch (path) {
      case 'compareProtocolVersion':
        return this.compareProtocolVersion(req)
      case 'getAgreementInfos':
        return this.getAgreementInfos(req)
      case 'beforeVerify':
        return this.beforeVerify(req)
      case 'login':
        if (req.url.pathname.split('/').slice(-2)[0] === 'v2') return this.exchangeComboToken(req)
        else return this.accountLogin(req)
      case 'verify':
        return this.tokenLogin(req)
      case 'listPriceTier':
        return this.listPriceTier(req)
      default:
        return new HttpResponse('404 page not found', 404)
    }
  }

  private loadUserData(auid: string): false | UserData {
    return getJson(`data/user/${hash(auid).slice(5, -5)}.json`, false)
  }

  private async compareProtocolVersion(req: HttpRequest): Promise<HttpResponse> {
    const { body } = req

    let major: number
    switch (config.version) {
      case '2.6.0':
        major = 10
        break
      case '2.7.0':
        major = 11
        break
      case '2.8.0':
      case '2.8.50':
        major = 13
        break
      default:
        major = 10
    }

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        modified: true,
        protocol: {
          id: 0,
          app_id: parseInt(body.app_id) || 4,
          language: body.language || 'en-us',
          user_proto: '',
          priv_proto: '',
          major,
          minimum: 0,
          create_time: '0',
          teenager_proto: '',
          third_proto: ''
        }
      }
    })
  }

  private async getAgreementInfos(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        marketing_agreements: []
      }
    })
  }

  private async beforeVerify(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        is_heartbeat_required: false,
        is_realname_required: false,
        is_guardian_required: false
      }
    })
  }

  private async exchangeComboToken(req: HttpRequest): Promise<HttpResponse> {
    const { data } = req.body
    const { uid, token } = JSON.parse(data)

    const hash1 = md5(token)
    const hash2 = md5(token + hash1)

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        combo_id: uid.slice(-8).padStart(8, '0'),
        open_id: uid,
        combo_token: hash1.slice(0, 20) + hash2.slice(0, 20),
        data: '{"guest":false}',
        heartbeat: false,
        account_type: 1
      }
    })
  }

  private async accountLogin(req: HttpRequest): Promise<HttpResponse> {
    const { body } = req
    const { account, password, is_crypto } = body

    console.log(body)

    const uid = hash(`HTGS:${account}:${password}:${Number(is_crypto)}`).slice(0, 9)
    const tokenBuf = Buffer.alloc(3)
    tokenBuf.writeUInt16LE(Math.floor(0x10000 * Math.random()))
    tokenBuf.writeUInt8(Math.floor(0x100 * Math.random()))

    let name = 'New Player'

    const userData = this.loadUserData(uid)
    if (userData) name = userData.profileData.nickname

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        account: {
          uid,
          name: '',
          email: name,
          mobile: '',
          is_email_verify: '0',
          realname: '',
          identity_card: '',
          token: tokenBuf.toString('base64'),
          safe_mobile: '',
          facebook_name: '',
          google_name: '',
          twitter_name: '',
          game_center_name: '',
          apple_name: '',
          sony_name: '',
          tap_name: '',
          country: 'HK',
          reactivate_ticket: '',
          area_code: '**',
          device_grant_ticket: '',
          steam_name: ''
        },
        device_grant_required: false,
        safe_moblie_required: false,
        reactivate_required: false,
        realperson_required: false,
        realname_operation: 'None'
      }
    })
  }

  private async tokenLogin(req: HttpRequest): Promise<HttpResponse> {
    const { body } = req
    const { uid, token } = body

    let name = 'New Player'

    const userData = this.loadUserData(uid)
    if (userData) name = userData.profileData.nickname

    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: {
        account: {
          uid,
          name: '',
          email: name,
          mobile: '',
          is_email_verify: '0',
          realname: '',
          identity_card: '',
          token,
          safe_mobile: '',
          facebook_name: '',
          google_name: '',
          twitter_name: '',
          game_center_name: '',
          apple_name: '',
          sony_name: '',
          tap_name: '',
          country: 'HK',
          reactivate_ticket: '',
          area_code: '**',
          device_grant_ticket: '',
          steam_name: ''
        },
        device_grant_required: false,
        safe_moblie_required: false,
        reactivate_required: false,
        realperson_required: false,
        realname_operation: 'None'
      }
    })
  }

  private async listPriceTier(_req: HttpRequest): Promise<HttpResponse> {
    return new HttpResponse({
      retcode: 0,
      message: 'OK',
      data: priceTier
    })
  }
}

let handler: Hk4eSdkHandler
export default (() => handler = handler || new Hk4eSdkHandler())()