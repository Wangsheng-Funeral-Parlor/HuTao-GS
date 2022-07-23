import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { VectorInterface } from '@/types/game/motion'
import { ClientState } from '@/types/enum/state'

export interface EvtAvatarLockChairReq {
  chairId: number
  position: VectorInterface
}

export interface EvtAvatarLockChairRsp {
  retcode: RetcodeEnum
  entityId: number
  position: VectorInterface
  chairId: number
}

class EvtAvatarLockChairPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarLockChair', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: EvtAvatarLockChairReq): Promise<void> {
    const { currentAvatar } = context.player
    if (!currentAvatar) return

    const { chairId, position } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId: currentAvatar.entityId,
      position,
      chairId
    })
  }

  async response(context: PacketContext, data: EvtAvatarLockChairRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EvtAvatarLockChairPacket
export default (() => packet = packet || new EvtAvatarLockChairPacket())()