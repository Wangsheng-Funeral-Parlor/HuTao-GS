import Packet, { PacketInterface, PacketContext } from '#/packet'
import hash from '@/utils/hash'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

interface GetPlayerTokenReq {
  accountType: number
  accountUid: string
  accountToken: string
  accountExt?: string
  uid?: number
  isGuest?: boolean
  platformType: number
  cloudClientIp?: number
  onlineId?: string
  psnRegion?: string
  channelId: number
  subChannelId?: number
  countryCode?: string
  psnId?: string
  clientIpStr?: string
}

interface GetPlayerTokenRsp {
  retcode: RetcodeEnum
  msg?: string
  uid: number
  token: string
  blackUidEndTime?: number
  accountType: number
  accountUid: string
  isProficientPlayer?: boolean
  secretKey?: string
  gmUid?: number
  secretKeySeed: string
  securityCmdBuffer: string
  platformType: number
  extraBinData?: string
  isGuest?: boolean
  channelId: number
  subChannelId?: number
  tag: number
  countryCode: string
  isLoginWhiteList?: boolean
  psnId?: string
  clientVersionRandomKey?: string
  regPlatform?: number
  clientIpStr?: string
}

class GetPlayerTokenPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerToken')
  }

  async request(context: PacketContext, data: GetPlayerTokenReq) {
    const { game, client } = context
    const { accountUid, accountToken, accountType, platformType, channelId } = data

    const uid = game.getUid(accountUid)
    const seed = hash(accountToken + Date.now()).slice(0, 19)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      uid: uid,
      token: accountToken,
      accountType: accountType,
      accountUid: accountUid,
      isProficientPlayer: true,
      secretKeySeed: seed,
      securityCmdBuffer: 'b39ETyh1gfpSg/6AVwTnilJQDLi8whrmKeORAAeLACQ=',
      platformType: platformType,
      channelId: channelId,
      tag: 5,
      countryCode: 'HK'
    })

    client.setKeyFromSeed(seed)
    client.setUid(accountUid, uid)

    // Set client state
    client.state = ClientState.EXCHANGE_TOKEN
  }

  async response(context: PacketContext, data: GetPlayerTokenRsp) {
    await super.response(context, data)
  }
}

let packet: GetPlayerTokenPacket
export default (() => packet = packet || new GetPlayerTokenPacket())()