import PlayerApplyEnterMpResult from "./PlayerApplyEnterMpResult"

import Packet, { PacketContext, PacketInterface } from "#/packet"
import Player from "$/player"
import { ClientStateEnum, PlayerPropEnum } from "@/types/enum"
import { OnlinePlayerInfo } from "@/types/proto"
import { ApplyEnterResultReasonEnum, MpSettingTypeEnum, RetcodeEnum } from "@/types/proto/enum"

export interface PlayerApplyEnterMpReq {
  targetUid: number
}

export interface PlayerApplyEnterMpRsp {
  retcode: RetcodeEnum
  targetUid: number
  param?: number
}

export interface PlayerApplyEnterMpNotify {
  srcPlayerInfo: OnlinePlayerInfo
  srcAppId?: number
  srcThreadIndex?: number
}

class PlayerApplyEnterMpPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerApplyEnterMp", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PlayerApplyEnterMpReq): Promise<void> {
    const { game, player } = context
    const { targetUid } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      targetUid,
    })

    const targetPlayer = game.getPlayerByUid(targetUid)
    if (!targetPlayer) return

    const targetWorld = targetPlayer.currentWorld
    if (targetWorld !== targetPlayer.hostWorld) {
      await PlayerApplyEnterMpResult.sendNotify(
        context,
        targetPlayer,
        false,
        ApplyEnterResultReasonEnum.PLAYER_NOT_IN_PLAYER_WORLD
      )
      return
    }
    if (targetWorld.playerList.length >= 4) {
      await PlayerApplyEnterMpResult.sendNotify(
        context,
        targetPlayer,
        false,
        ApplyEnterResultReasonEnum.ALLOW_ENTER_PLAYER_FULL
      )
      return
    }

    switch (targetPlayer.props.get(PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE)) {
      case MpSettingTypeEnum.MP_SETTING_ENTER_AFTER_APPLY:
        await this.sendNotify(targetPlayer.context, player)
        break
      case MpSettingTypeEnum.MP_SETTING_ENTER_FREELY:
        await PlayerApplyEnterMpResult.sendNotify(context, targetPlayer, true, ApplyEnterResultReasonEnum.SYSTEM_JUDGE)
        break
      case MpSettingTypeEnum.MP_SETTING_NO_ENTER:
        await PlayerApplyEnterMpResult.sendNotify(context, targetPlayer, false, ApplyEnterResultReasonEnum.SYSTEM_JUDGE)
        break
    }
  }

  async response(context: PacketContext, data: PlayerApplyEnterMpRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, player: Player): Promise<void> {
    const notifyData: PlayerApplyEnterMpNotify = {
      srcPlayerInfo: player.exportOnlinePlayerInfo(),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerApplyEnterMpPacket
export default (() => (packet = packet || new PlayerApplyEnterMpPacket()))()
