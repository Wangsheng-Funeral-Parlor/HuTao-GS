import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { ChatEmojiCollectionData } from '@/types/game/chat'

export interface SetChatEmojiCollectionReq {
  chatEmojiCollectionData: ChatEmojiCollectionData
}

export interface SetChatEmojiCollectionRsp {
  retcode: RetcodeEnum
}

class SetChatEmojiCollectionPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetChatEmojiCollection', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetChatEmojiCollectionReq): Promise<void> {
    const { player } = context
    const { chatEmojiCollectionData } = data

    player.emojiCollection = chatEmojiCollectionData?.emojiIdList || []

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: SetChatEmojiCollectionRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetChatEmojiCollectionPacket
export default (() => packet = packet || new SetChatEmojiCollectionPacket())()