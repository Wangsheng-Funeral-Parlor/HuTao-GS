import Packet, { PacketContext, PacketInterface } from "#/packet"
import Avatar from "$/entity/avatar"
import { ClientStateEnum } from "@/types/enum"
import { SceneEntityInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface AvatarChangeCostumeReq {
  avatarGuid: string
  costumeId: number
}

export interface AvatarChangeCostumeRsp {
  retcode: RetcodeEnum
  avatarGuid?: string
  costumeId?: number
}

export interface AvatarChangeCostumeNotify {
  entityInfo: SceneEntityInfo
}

class AvatarChangeCostumePacket extends Packet implements PacketInterface {
  constructor() {
    super("AvatarChangeCostume", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: AvatarChangeCostumeReq): Promise<void> {
    const { player } = context
    const { avatarGuid, costumeId } = data

    const retcode = await player.changeCostume(BigInt(avatarGuid), costumeId)

    await this.response(context, {
      retcode,
      avatarGuid,
      costumeId,
    })
  }

  async response(context: PacketContext, data: AvatarChangeCostumeRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, avatar: Avatar): Promise<void> {
    const notifyData: AvatarChangeCostumeNotify = {
      entityInfo: avatar.exportSceneEntityInfo(),
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], avatar: Avatar): Promise<void> {
    await super.broadcastNotify(contextList, avatar)
  }
}

let packet: AvatarChangeCostumePacket
export default (() => (packet = packet || new AvatarChangeCostumePacket()))()
