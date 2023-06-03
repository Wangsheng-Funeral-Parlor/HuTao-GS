import Packet, { PacketContext, PacketInterface } from "#/packet"
import Player from "$/player"
import { ClientStateEnum } from "@/types/enum"
import { ApplyEnterResultReasonEnum, RetcodeEnum } from "@/types/proto/enum"

export interface PlayerApplyEnterMpResultReq {
  applyUid: number
  isAgreed: boolean
}

export interface PlayerApplyEnterMpResultRsp {
  retcode: RetcodeEnum
  applyUid: number
  isAgreed: boolean
  param?: number
}

export interface PlayerApplyEnterMpResultNotify {
  targetUid: number
  isAgreed: boolean
  reason: ApplyEnterResultReasonEnum
  targetNickname: string
}

class PlayerApplyEnterMpResultPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerApplyEnterMpResult", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PlayerApplyEnterMpResultReq): Promise<void> {
    const { game, player } = context
    const { applyUid, isAgreed } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      applyUid,
      isAgreed,
    })

    const applyPlayer = game.getPlayerByUid(applyUid)
    if (applyPlayer) await this.sendNotify(applyPlayer.context, player, isAgreed)
  }

  async response(context: PacketContext, data: PlayerApplyEnterMpResultRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(
    context: PacketContext,
    targetPlayer: Player,
    isAgreed: boolean,
    reason: ApplyEnterResultReasonEnum = ApplyEnterResultReasonEnum.PLAYER_JUDGE
  ): Promise<void> {
    const { uid, profile } = targetPlayer
    const notifyData: PlayerApplyEnterMpResultNotify = {
      targetUid: uid,
      isAgreed,
      reason,
      targetNickname: profile.nickname,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerApplyEnterMpResultPacket
export default (() => (packet = packet || new PlayerApplyEnterMpResultPacket()))()
