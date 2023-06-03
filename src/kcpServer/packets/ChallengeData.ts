import Packet, { PacketInterface, PacketContext } from "#/packet"

export interface ChallengeDataNotify {
  paramIndex: number
  value: number
  challengeIndex: number
}

class ChallengeDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("ChallengeData")
  }

  async sendNotify(context: PacketContext, notifyData: ChallengeDataNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], notifyData: ChallengeDataNotify): Promise<void> {
    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: ChallengeDataPacket
export default (() => (packet = packet || new ChallengeDataPacket()))()
