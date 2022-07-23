import Packet, { PacketInterface, PacketContext } from '#/packet'
import { OnlinePlayerInfo } from '@/types/game/playerInfo'
import { RetcodeEnum } from '@/types/enum/Retcode'

export interface GetOnlinePlayerListReq { }

export interface GetOnlinePlayerListRsp {
  retcode: RetcodeEnum
  playerInfoList: OnlinePlayerInfo[]
  param?: number
}

class GetOnlinePlayerListPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetOnlinePlayerList')
  }

  async request(context: PacketContext, _data: GetOnlinePlayerListReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      playerInfoList: context.game.getOnlinePlayerList(context.player)
    })
  }

  async response(context: PacketContext, data: GetOnlinePlayerListRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetOnlinePlayerListPacket
export default (() => packet = packet || new GetOnlinePlayerListPacket())()