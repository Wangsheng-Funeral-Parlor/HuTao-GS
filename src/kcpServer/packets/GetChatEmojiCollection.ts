import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ChatEmojiCollectionData } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetChatEmojiCollectionReq { }

export interface GetChatEmojiCollectionRsp {
  retcode: RetcodeEnum
  chatEmojiCollectionData: ChatEmojiCollectionData
}

class GetChatEmojiCollectionPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetChatEmojiCollection', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: GetChatEmojiCollectionReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      chatEmojiCollectionData: {
        emojiIdList: context.player.emojiCollection
      }
    })
  }

  async response(context: PacketContext, data: GetChatEmojiCollectionRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetChatEmojiCollectionPacket
export default (() => packet = packet || new GetChatEmojiCollectionPacket())()