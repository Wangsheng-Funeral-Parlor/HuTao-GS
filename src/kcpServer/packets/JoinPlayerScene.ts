import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface JoinPlayerSceneReq {
  targetUid: number
}

export interface JoinPlayerSceneRsp {
  retcode: RetcodeEnum
}

class JoinPlayerScenePacket extends Packet implements PacketInterface {
  constructor() {
    super("JoinPlayerScene", {
      reqWaitState: ClientStateEnum.POST_LOGIN,
      reqWaitStatePass: true,
    })
  }

  async request(context: PacketContext, data: JoinPlayerSceneReq): Promise<void> {
    const { game, player } = context
    const { targetUid } = data

    const targetPlayer = game.getPlayerByUid(targetUid)
    if (!targetPlayer) return

    const { hostWorld } = targetPlayer

    await this.response(context, {
      retcode: hostWorld.mpMode ? RetcodeEnum.RET_SUCC : RetcodeEnum.RET_JOIN_OTHER_WAIT,
    })

    const hostAlreadyInMp = hostWorld.mpMode
    await hostWorld.changeToMp()

    await player.currentWorld.leave(context)

    if (hostAlreadyInMp) await hostWorld.join(context)
    else await game.playerLogin(context, hostWorld)

    hostWorld.updateMpTeam()
  }

  async response(context: PacketContext, data: JoinPlayerSceneRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: JoinPlayerScenePacket
export default (() => (packet = packet || new JoinPlayerScenePacket()))()
