import Packet, { PacketInterface, PacketContext } from "#/packet"
import Challenge from "$/challenge"
import {
  ChannellerSlabLoopDungeonResultInfo,
  CustomDungeonResultInfo,
  EffigyChallengeDungeonResultInfo,
  PotionDungeonResultInfo,
  StrengthenPointData,
} from "@/types/proto"

export interface DungeonChallengeFinishNotify {
  challengeIndex: number
  finishType?: number
  isSuccess: boolean
  challengeRecordType: number
  isNewRecord?: boolean
  currentValue?: number
  timeCost?: number
  strengthenPointDataMap?: { [id: number]: StrengthenPointData }
  channellerSlabLoopDungeonResultInfo?: ChannellerSlabLoopDungeonResultInfo
  effigyChallengeDungeonResultInfo?: EffigyChallengeDungeonResultInfo
  potionDungeonResultInfo?: PotionDungeonResultInfo
  customDungeonResultInfo?: CustomDungeonResultInfo
}

class DungeonChallengeFinishPacket extends Packet implements PacketInterface {
  constructor() {
    super("DungeonChallengeFinish")
  }

  async sendNotify(context: PacketContext, notifyData: DungeonChallengeFinishNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], challenge: Challenge): Promise<void> {
    const notifyData: DungeonChallengeFinishNotify = {
      challengeIndex: challenge.challengeIndex,
      finishType: challenge.success ? 2 : 1,
      isSuccess: challenge.success,
      challengeRecordType: 2,
    }
    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: DungeonChallengeFinishPacket
export default (() => (packet = packet || new DungeonChallengeFinishPacket()))()
