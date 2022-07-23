import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { ActivityInfo } from '@/types/game/activity'

export interface GetActivityInfoReq {
  activityIdList: number[]
}

export interface GetActivityInfoRsp {
  retcode: RetcodeEnum
  activityInfoList: ActivityInfo[]
  activatedSaleIdList: number[]
  disableTransferPointInteractionList: { key: number, value: number }[]
}

class GetActivityInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetActivityInfo', {
      reqWaitState: ClientState.POST_LOGIN,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, data: GetActivityInfoReq): Promise<void> {
    const { game, player } = context
    const { activityIdList } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      activityInfoList: game.activityManager.exportActivityInfoList(player, activityIdList),
      activatedSaleIdList: [],
      disableTransferPointInteractionList: []
    })
  }

  async response(context: PacketContext, data: GetActivityInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetActivityInfoPacket
export default (() => packet = packet || new GetActivityInfoPacket())()