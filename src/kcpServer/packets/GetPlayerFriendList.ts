import Packet, { PacketInterface, PacketContext } from '#/packet'
import { FriendBrief } from '@/types/game/social'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface GetPlayerFriendListReq { }

export interface GetPlayerFriendListRsp {
  retcode: RetcodeEnum
  friendList: FriendBrief[]
  askFriendList?: FriendBrief[]
}

class GetPlayerFriendListPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerFriendList', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: GetPlayerFriendListReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      friendList: [
        context.game.playerMap['1'].exportFriendBrief()
      ]
    })
  }

  async response(context: PacketContext, data: GetPlayerFriendListRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetPlayerFriendListPacket
export default (() => packet = packet || new GetPlayerFriendListPacket())()