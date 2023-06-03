import Packet, { PacketContext, PacketInterface } from "#/packet"
import Avatar from "$/entity/avatar"
import { ClientStateEnum } from "@/types/enum"
import { ServerBuff } from "@/types/proto"
import { LifeStateEnum, PlayerDieTypeEnum } from "@/types/proto/enum"

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
    super("AvatarLifeStateChange")
  }

  async sendNotify(context: PacketContext, avatar: Avatar): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN, true)) return

    const { guid, lifeState, dieType, attackerId } = avatar

    const notifyData: AvatarLifeStateChangeNotify = {
      avatarGuid: guid.toString(),
      lifeState,
      sourceEntityId: attackerId,
      dieType,
      serverBuffList: [],
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AvatarLifeStateChangePacket
export default (() => (packet = packet || new AvatarLifeStateChangePacket()))()
