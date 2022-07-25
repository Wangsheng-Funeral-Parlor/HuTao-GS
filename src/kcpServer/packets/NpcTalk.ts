import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface NpcTalkReq {
  npcEntityId?: number
  talkId: number
  entityId: number
}

export interface NpcTalkRsp {
  retcode: RetcodeEnum
  npcEntityId?: number
  curTalkId: number
  entityId: number
}

class NpcTalkPacket extends Packet implements PacketInterface {
  constructor() {
    super('NpcTalk', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: NpcTalkReq): Promise<void> {
    const { talkId, entityId } = data

    await context.player.emit('NpcTalkReq', data)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      curTalkId: talkId,
      entityId
    })
  }

  async response(context: PacketContext, data: NpcTalkRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: NpcTalkPacket
export default (() => packet = packet || new NpcTalkPacket())()