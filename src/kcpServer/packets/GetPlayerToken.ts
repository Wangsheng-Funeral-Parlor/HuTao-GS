import Packet, { PacketContext, PacketInterface } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'
import DispatchKey from '@/utils/dispatchKey'
import hash from '@/utils/hash'
import MT19937 from '@/utils/mt19937'
import { rsaDecrypt, rsaEncrypt, rsaSign } from '@/utils/rsa'

interface GetPlayerTokenReq {
  accountType: number
  accountUid: string
  accountToken: string
  accountExt?: string
  uid?: number
  birthday?: string
  isGuest?: boolean
  platformType: number
  onlineId?: string
  psnRegion?: string
  channelId: number
  subChannelId?: number
  countryCode?: string
  psnId?: string
  clientIpStr?: string
  cloudClientIp?: number
  // >= 2.7.50
  keyId?: number
  clientSeed?: string
}

interface GetPlayerTokenRsp {
  retcode: RetcodeEnum
  msg?: string
  uid: number
  token: string
  blackUidEndTime?: number
  accountType: number
  accountUid: string
  birthday?: string
  isProficientPlayer?: boolean
  secretKey?: string
  gmUid?: number
  secretKeySeed?: string
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
  // >= 2.7.50
  encryptedSeed?: string
  seedSignature?: string
}

class GetPlayerTokenPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerToken')
  }

  async request(context: PacketContext, data: GetPlayerTokenReq) {
    const { game, client } = context
    const { accountUid, accountToken, accountType, platformType, channelId, clientSeed, keyId } = data

    const uid = await game.getUid(accountUid)

    const mt = new MT19937()
    mt.seed(BigInt(hash(accountToken + Date.now()).slice(0, 19)))

    const times = Math.max(16 * Math.random(), 2)
    for (let i = 0; i < times; i++) mt.int64()

    const seed = mt.int64()

    const rsp: GetPlayerTokenRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      uid: uid,
      token: accountToken,
      accountType: accountType,
      accountUid: accountUid,
      isProficientPlayer: true,
      securityCmdBuffer: 'b39ETyh1gfpSg/6AVwTnilJQDLi8whrmKeORAAeLACQ=',
      platformType: platformType,
      channelId: channelId,
      regPlatform: 1,
      tag: 5,
      countryCode: 'HK'
    }

    if (keyId != null) {
      // >= 2.7.50
      const { encrypt, signing } = await DispatchKey.getKeyPairs(keyId)

      const cseedEncrypted = Buffer.from(clientSeed, 'base64')
      const cseed = rsaDecrypt(signing.private.pem, cseedEncrypted)

      const seedBuf = Buffer.alloc(8)
      seedBuf.writeBigUInt64BE(seed ^ cseed.readBigUInt64BE())

      rsp.encryptedSeed = rsaEncrypt(encrypt.public.pem, seedBuf).toString('base64')
      rsp.seedSignature = rsaSign(signing.private.pem, seedBuf).toString('base64')
    } else {
      // < 2.7.50
      rsp.secretKeySeed = seed.toString()
    }

    await this.response(context, rsp)

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