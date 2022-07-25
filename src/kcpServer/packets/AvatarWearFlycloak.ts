import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

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
    super('AvatarWearFlycloak', {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: AvatarWearFlycloakReq): Promise<void> {
    const { player } = context
    const { avatarGuid, flycloakId } = data

    const retcode = await player.wearFlycloak(BigInt(avatarGuid), flycloakId)

    await this.response(context, {
      retcode,
      avatarGuid,
      flycloakId
    })
  }

  async response(context: PacketContext, data: AvatarWearFlycloakRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: AvatarWearFlycloakPacket
export default (() => packet = packet || new AvatarWearFlycloakPacket())()