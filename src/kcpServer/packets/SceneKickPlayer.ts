import Packet, { PacketInterface, PacketContext } from "#/packet"
import Player from "$/player"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SceneKickPlayerReq {
  targetUid: number
}

export interface SceneKickPlayerRsp {
  retcode: RetcodeEnum
  targetUid?: number
}

export interface SceneKickPlayerNotify {
  kickerUid: number
  targetUid: number
}

class SceneKickPlayerPacket extends Packet implements PacketInterface {
  constructor() {
    super("SceneKickPlayer", {
      reqState: ClientStateEnum.ENTER_SCENE,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SceneKickPlayerReq): Promise<void> {
    const { player } = context
    const { currentWorld } = player
    const { targetUid } = data

    if (!player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_MP_NOT_IN_MY_WORLD })
      return
    }

    if (!(await currentWorld.kick(targetUid))) {
      await this.response(context, { retcode: RetcodeEnum.RET_PLAYER_NOT_EXIST })
      return
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      targetUid,
    })
  }

  async response(context: PacketContext, data: SceneKickPlayerRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, kickerPlayer: Player, targetPlayer: Player): Promise<void> {
    const notifyData: SceneKickPlayerNotify = {
      kickerUid: kickerPlayer.uid,
      targetUid: targetPlayer.uid,
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], kicker: Player, target: Player): Promise<void> {
    await super.broadcastNotify(contextList, kicker, target)
  }
}

let packet: SceneKickPlayerPacket
export default (() => (packet = packet || new SceneKickPlayerPacket()))()
