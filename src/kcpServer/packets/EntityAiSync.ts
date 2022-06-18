import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AiSyncInfo } from '@/types/game/monster'

export interface EntityAiSyncNotify {
  infoList: AiSyncInfo[]
  localAvatarAlertedMonsterList: number[]
}

class EntityAiSyncPacket extends Packet implements PacketInterface {
  constructor() {
    super('EntityAiSync', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EntityAiSyncNotify): Promise<void> {
    const { player } = context
    await this.broadcastNotify(player?.currentScene?.broadcastContextList.filter(ctx => ctx.player !== player) || [], data)
  }

  async sendNotify(context: PacketContext, data: EntityAiSyncNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EntityAiSyncNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EntityAiSyncPacket
export default (() => packet = packet || new EntityAiSyncPacket())()