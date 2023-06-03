import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"
import DispatchKey from "@/utils/dispatchKey"
import { rsaDecrypt, rsaEncrypt, rsaSign } from "@/utils/rsa"

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
  // custom name
  clientSeed?: string
  // official name
  clientRandKey?: string
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
  // custom name
  encryptedSeed?: string
  seedSignature?: string
  // official name
  serverRandKey?: string
  sign?: string
}

class GetPlayerTokenPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetPlayerToken")
  }

  async request(context: PacketContext, data: GetPlayerTokenReq) {
    const { game, client } = context
    const { accountUid, accountToken, accountType, platformType, channelId, keyId, clientSeed, clientRandKey } = data

    const { uid, userData } = await game.getPlayerInfo(accountUid)
    const seed =
      (BigInt(Math.floor(0x10000 * Math.random())) << 48n) |
      (BigInt(Math.floor(0x10000 * Math.random())) << 32n) |
      (BigInt(Math.floor(0x10000 * Math.random())) << 16n) |
      BigInt(Math.floor(0x10000 * Math.random()))

    const rsp: GetPlayerTokenRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      uid: uid,
      token: accountToken,
      accountType: accountType,
      accountUid: accountUid,
      isProficientPlayer: !!userData,
      securityCmdBuffer: "b39ETyh1gfpSg/6AVwTnilJQDLi8whrmKeORAAeLACQ=",
      platformType: platformType,
      channelId: channelId,
      regPlatform: 1,
      tag: 5,
      countryCode: "HK",
    }

    if (keyId != null) {
      // >= 2.7.50
      const { client, server } = await DispatchKey.getKeyPairs(keyId)

      const crkEncrypted = Buffer.from(clientSeed || clientRandKey, "base64")
      const crk = rsaDecrypt(server.private, crkEncrypted)

      const srk = Buffer.alloc(8)
      srk.writeBigUInt64BE(seed ^ crk.readBigUInt64BE())

      rsp.serverRandKey = rsp.encryptedSeed = rsaEncrypt(client.public, srk).toString("base64")
      rsp.sign = rsp.seedSignature = rsaSign(server.private, srk).toString("base64")
    } else {
      // < 2.7.50
      rsp.secretKeySeed = seed.toString()
    }

    await this.response(context, rsp)

    await client.setKeyFromSeed(seed)
    client.setUid(accountUid, uid)

    // Set client state
    client.state = ClientStateEnum.EXCHANGE_TOKEN
  }

  async response(context: PacketContext, data: GetPlayerTokenRsp) {
    await super.response(context, data)
  }
}

let packet: GetPlayerTokenPacket
export default (() => (packet = packet || new GetPlayerTokenPacket()))()
