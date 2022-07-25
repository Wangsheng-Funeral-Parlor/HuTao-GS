import Packet, { PacketContext, PacketInterface } from '#/packet'
import { Quest } from '@/types/proto'
import { getTimeSeconds } from '@/utils/time'

export interface QuestListNotify {
  questList: Quest[]
}

class QuestListPacket extends Packet implements PacketInterface {
  constructor() {
    super('QuestList')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const now = getTimeSeconds()

    const notifyData: QuestListNotify = {
      questList: [
        {
          questId: 30303,
          state: 3,
          startTime: now,
          parentQuestId: 303,
          startGameTime: context.player.gameTime,
          acceptTime: now,
          finishProgressList: [
            1
          ]
        }
      ]
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: QuestListPacket
export default (() => packet = packet || new QuestListPacket())()