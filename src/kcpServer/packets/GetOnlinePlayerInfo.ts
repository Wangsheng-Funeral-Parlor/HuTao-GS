import Packet, { PacketContext, PacketInterface } from '#/packet'
import { OnlinePlayerInfo } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetOnlinePlayerInfoReq {
  targetUid?: number
  onlineId?: string
  psnId?: string

  isOnlineId?: boolean
}

export interface GetOnlinePlayerInfoRsp {
  retcode: RetcodeEnum
  targetUid?: number
  targetPlayerInfo?: OnlinePlayerInfo | {}
  param?: number
}

class GetOnlinePlayerInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetOnlinePlayerInfo')
  }

  async request(context: PacketContext, data: GetOnlinePlayerInfoReq): Promise<void> {
    const { targetUid } = data
    if (isNaN(targetUid) || targetUid <= 0) {
      await this.response(context, { retcode: RetcodeEnum.RET_UID_NOT_EXIST })
      return
    }

    const playerInfo = context.game.getOnlinePlayerInfo(targetUid)

    await this.response(context, {
      retcode: playerInfo ? RetcodeEnum.RET_SUCC : RetcodeEnum.RET_PLAYER_NOT_ONLINE,
      targetUid,
      targetPlayerInfo: playerInfo || {}
    })
  }

  async response(context: PacketContext, data: GetOnlinePlayerInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetOnlinePlayerInfoPacket
export default (() => packet = packet || new GetOnlinePlayerInfoPacket())()