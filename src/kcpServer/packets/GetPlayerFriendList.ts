import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { FriendBrief } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetPlayerFriendListReq {}

export interface GetPlayerFriendListRsp {
  retcode: RetcodeEnum
  friendList: FriendBrief[]
  askFriendList?: FriendBrief[]
}

class GetPlayerFriendListPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetPlayerFriendList", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, _data: GetPlayerFriendListReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      friendList: [context.game.playerMap["1"].exportFriendBrief()],
    })
  }

  async response(context: PacketContext, data: GetPlayerFriendListRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetPlayerFriendListPacket
export default (() => (packet = packet || new GetPlayerFriendListPacket()))()
