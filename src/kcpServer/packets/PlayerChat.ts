import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'
import { ChatInfo } from '@/types/game/chat'

export interface PlayerChatReq {
  channelId: number
  chatInfo: ChatInfo
}

export interface PlayerChatRsp {
  retcode: RetcodeEnum
  chatForbiddenEndtime?: number
}

export interface PlayerChatNotify {
  channelId: number
  chatInfo: ChatInfo
}

class PlayerChatPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerChat', {
      reqState: ClientState.ENTER_SCENE,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PlayerChatReq): Promise<void> {
    const { game, player } = context
    const { channelId, chatInfo } = data

    chatInfo.uid = player.uid

    if (!await game.chatManager.sendPublic(player.currentWorld, channelId || 0, chatInfo)) {
      await this.response(context, { retcode: RetcodeEnum.RET_SVR_ERROR })
      return
    }

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: PlayerChatRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, channelId: number, chatInfo: ChatInfo): Promise<void> {
    const notifyData: PlayerChatNotify = { channelId, chatInfo }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], channelId: number, chatInfo: ChatInfo): Promise<void> {
    await super.broadcastNotify(contextList, channelId, chatInfo)
  }
}

let packet: PlayerChatPacket
export default (() => packet = packet || new PlayerChatPacket())()