import Packet, { PacketInterface, PacketContext } from '#/packet'
import PrivateChatChannel from '$/chat/privateChatChannel'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'
import { ChatInfo } from '@/types/game/chat'

export interface PrivateChatReq {
  text?: string
  icon?: number

  targetUid: number
}

export interface PrivateChatRsp {
  retcode: RetcodeEnum
  chatForbiddenEndtime?: number
}

export interface PrivateChatNotify {
  chatInfo: ChatInfo
}

class PrivateChatPacket extends Packet implements PacketInterface {
  constructor() {
    super('PrivateChat', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PrivateChatReq): Promise<void> {
    const { game, player } = context

    const chatInfo = PrivateChatChannel.createChatInfo(player, data)
    chatInfo.uid = player.uid

    if (!await game.chatManager.sendPrivate(chatInfo)) {
      await this.response(context, { retcode: RetcodeEnum.RET_PLAYER_NOT_EXIST })
      return
    }

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: PrivateChatRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, chatInfo: ChatInfo): Promise<void> {
    const notifyData: PrivateChatNotify = { chatInfo }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], chatInfo: ChatInfo): Promise<void> {
    await super.broadcastNotify(contextList, chatInfo)
  }
}

let packet: PrivateChatPacket
export default (() => packet = packet || new PrivateChatPacket())()