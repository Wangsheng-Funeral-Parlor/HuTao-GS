import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface PlayerGetForceQuitBanInfoReq { }

export interface PlayerGetForceQuitBanInfoRsp {
  retcode: RetcodeEnum
  matchId?: number
  expireTime?: number
}

class PlayerGetForceQuitBanInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerGetForceQuitBanInfo')
  }

  async request(context: PacketContext, _data: PlayerGetForceQuitBanInfoReq): Promise<void> {
    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: PlayerGetForceQuitBanInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PlayerGetForceQuitBanInfoPacket
export default (() => packet = packet || new PlayerGetForceQuitBanInfoPacket())()