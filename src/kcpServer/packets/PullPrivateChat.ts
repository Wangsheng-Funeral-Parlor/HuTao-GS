import Packet, { PacketContext, PacketInterface } from "#/packet"
import config from "@/config"
import { ClientStateEnum } from "@/types/enum"
import { ChatInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface PullPrivateChatReq {
  targetUid: number
  fromSequence: number
  pullNum: number
}

export interface PullPrivateChatRsp {
  retcode: RetcodeEnum
  chatInfo: ChatInfo[]
}

class PullPrivateChatPacket extends Packet implements PacketInterface {
  constructor() {
    super("PullPrivateChat", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PullPrivateChatReq): Promise<void> {
    const { game, player } = context
    const { targetUid, pullNum, fromSequence } = data

    const chatinfo = game.chatManager.pullPrivate(player, targetUid, fromSequence || 0, pullNum || 0).length
      ? game.chatManager.pullPrivate(player, targetUid, fromSequence || 0, pullNum || 0)
      : [{ time: Date.now(), uid: 1, toUid: player.uid, text: `Game Version ${config.game.version}` }]

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      chatInfo: chatinfo,
    })
  }

  async response(context: PacketContext, data: PullPrivateChatRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PullPrivateChatPacket
export default (() => (packet = packet || new PullPrivateChatPacket()))()
