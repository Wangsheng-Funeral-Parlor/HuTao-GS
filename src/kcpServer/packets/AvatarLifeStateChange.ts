import Packet, { PacketInterface, PacketContext } from '#/packet'
import Avatar from '$/entity/avatar'
import { LifeStateEnum } from '@/types/enum/entity'
import { PlayerDieTypeEnum } from '@/types/enum/player'
import { ClientState } from '@/types/enum/state'
import { ServerBuff } from '@/types/game/avatar'

export interface AvatarLifeStateChangeNotify {
  avatarGuid: string
  lifeState: LifeStateEnum
  sourceEntityId: number
  attackTag?: string
  dieType: PlayerDieTypeEnum
  moveReliableSeq?: number
  serverBuffList: ServerBuff[]
}

class AvatarLifeStateChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarLifeStateChange')
  }

  async sendNotify(context: PacketContext, avatar: Avatar): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN, true)) return

    const { guid, lifeState, dieType, attackerId } = avatar

    const notifyData: AvatarLifeStateChangeNotify = {
      avatarGuid: guid.toString(),
      lifeState,
      sourceEntityId: attackerId,
      dieType,
      serverBuffList: []
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AvatarLifeStateChangePacket
export default (() => packet = packet || new AvatarLifeStateChangePacket())()