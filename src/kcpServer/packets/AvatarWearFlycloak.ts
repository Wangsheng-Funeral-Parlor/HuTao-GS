import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface AvatarWearFlycloakReq {
  avatarGuid: string
  flycloakId: number
}

export interface AvatarWearFlycloakRsp {
  retcode: RetcodeEnum
  avatarGuid?: string
  flycloakId?: number
}

class AvatarWearFlycloakPacket extends Packet implements PacketInterface {
  constructor() {
    super("AvatarWearFlycloak", {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xf0ff,
    })
  }

  async request(context: PacketContext, data: AvatarWearFlycloakReq): Promise<void> {
    const { player } = context
    const { avatarGuid, flycloakId } = data

    const retcode = await player.wearFlycloak(BigInt(avatarGuid), flycloakId)

    await this.response(context, {
      retcode,
      avatarGuid,
      flycloakId,
    })
  }

  async response(context: PacketContext, data: AvatarWearFlycloakRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: AvatarWearFlycloakPacket
export default (() => (packet = packet || new AvatarWearFlycloakPacket()))()
