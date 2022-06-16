import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { SocialDetail } from '@/types/game/social'
import { ClientState } from '@/types/enum/state'

export interface GetPlayerSocialDetailReq {
  uid: number
}

export interface GetPlayerSocialDetailRsp {
  retcode: RetcodeEnum
  detailData: SocialDetail
}

class GetPlayerSocialDetailPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerSocialDetail', {
      reqWaitState: ClientState.POST_LOGIN,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, data: GetPlayerSocialDetailReq): Promise<void> {
    const { game, player } = context
    const { uid } = data

    let detailData: SocialDetail

    if (uid !== player.uid) {
      detailData = game.getPlayerByUid(uid)?.exportSocialDetail(uid === 1)
      if (!detailData) await this.response(context, { retcode: RetcodeEnum.RET_UID_NOT_EXIST, detailData })
    } else {
      detailData = player.exportSocialDetail(true)
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      detailData
    })
  }

  async response(context: PacketContext, data: GetPlayerSocialDetailRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetPlayerSocialDetailPacket
export default (() => packet = packet || new GetPlayerSocialDetailPacket())()