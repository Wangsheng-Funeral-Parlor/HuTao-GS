import Packet, { PacketInterface, PacketContext } from "#/packet"
import Challenge from "$/challenge"

export interface DungeonChallengeBeginNotify {
  challengeId: number
  challengeIndex: number
  groupId: number
  fatherIndex?: number
  uidList?: number[]
  paramList?: number[]
}

class DungeonChallengeBeginPacket extends Packet implements PacketInterface {
  constructor() {
    super("DungeonChallengeBegin")
  }

  async sendNotify(context: PacketContext, notifyData: DungeonChallengeBeginNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], challenge: Challenge): Promise<void> {
    const notifyData: DungeonChallengeBeginNotify = {
      challengeId: challenge.challengeId,
      challengeIndex: challenge.challengeIndex,
      groupId: challenge.sceneGroup.id,
      paramList: challenge.paramList,
    }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: DungeonChallengeBeginPacket
export default (() => (packet = packet || new DungeonChallengeBeginPacket()))()
