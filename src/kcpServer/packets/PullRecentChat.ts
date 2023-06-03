import Packet, { PacketContext, PacketInterface } from "#/packet"
import config from "@/config"
import { ClientStateEnum } from "@/types/enum"
import { ChatInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface PullRecentChatReq {
  beginSequence: number
  pullNum: number
}

export interface PullRecentChatRsp {
  retcode: RetcodeEnum
  chatInfo: ChatInfo[]
}

class PullRecentChatPacket extends Packet implements PacketInterface {
  constructor() {
    super("PullRecentChat", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PullRecentChatReq): Promise<void> {
    const { game, player } = context
    const { beginSequence, pullNum } = data
    const chatinfo = game.chatManager.pullRecent(player, beginSequence || 0, pullNum || 0).length
      ? game.chatManager.pullRecent(player, beginSequence || 0, pullNum || 0)
      : [{ time: Date.now(), uid: 1, toUid: player.uid, text: `Game Version ${config.game.version}` }]
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      chatInfo: chatinfo,
    })
  }

  async response(context: PacketContext, data: PullRecentChatRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PullRecentChatPacket
export default (() => (packet = packet || new PullRecentChatPacket()))()
