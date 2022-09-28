import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { VectorInfo } from '@/types/proto'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtDoSkillSuccNotify {
  forwardType: ForwardTypeEnum
  casterId: number
  skillId: number
  forward: VectorInfo
}

class EvtDoSkillSuccPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtDoSkillSucc', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtDoSkillSuccNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }
}

let packet: EvtDoSkillSuccPacket
export default (() => packet = packet || new EvtDoSkillSuccPacket())()