import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface SetEquipLockStateReq {
  targetEquipGuid: string
  isLocked: boolean
}

export interface SetEquipLockStateRsp {
  retcode: RetcodeEnum
  targetEquipGuid?: string
  isLocked?: boolean
}

class SetEquipLockStatePacket extends Packet implements PacketInterface {
  constructor() {
    super('SetEquipLockState', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetEquipLockStateReq): Promise<void> {
    const { player } = context
    const { targetEquipGuid, isLocked } = data

    const equip = player.getEquip(BigInt(targetEquipGuid))
    if (!equip) {
      await this.response(context, { retcode: RetcodeEnum.RET_ITEM_NOT_EXIST })
      return
    }

    equip.isLocked = !!isLocked

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      targetEquipGuid,
      isLocked
    })
  }

  async response(context: PacketContext, data: SetEquipLockStateRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetEquipLockStatePacket
export default (() => packet = packet || new SetEquipLockStatePacket())()