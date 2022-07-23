import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { ChatInfo } from '@/types/game/chat'

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
    super('PullPrivateChat', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PullPrivateChatReq): Promise<void> {
    const { game, player } = context
    const { targetUid, fromSequence, pullNum } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      chatInfo: game.chatManager.pullPrivate(player, targetUid, fromSequence || 0, pullNum || 0)
    })
  }

  async response(context: PacketContext, data: PullPrivateChatRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PullPrivateChatPacket
export default (() => packet = packet || new PullPrivateChatPacket())()