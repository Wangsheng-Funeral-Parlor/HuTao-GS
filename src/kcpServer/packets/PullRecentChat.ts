import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { ChatInfo } from '@/types/game/chat'

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
    super('PullRecentChat', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PullRecentChatReq): Promise<void> {
    const { game, player } = context
    const { beginSequence, pullNum } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      chatInfo: game.chatManager.pullRecent(player, beginSequence || 0, pullNum || 0)
    })
  }

  async response(context: PacketContext, data: PullRecentChatRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PullRecentChatPacket
export default (() => packet = packet || new PullRecentChatPacket())()