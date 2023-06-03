import Packet, { PacketContext, PacketInterface } from "#/packet"
import { LockedPersonallineData } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface PersonalLineAllDataReq {}

export interface PersonalLineAllDataRsp {
  retcode: RetcodeEnum
  curFinishedDailyTaskCount: number
  legendaryKeyCount: number
  ongoingPersonalLineList: number[]
  canBeUnlockedPersonalLineList: number[]
  lockedPersonalLineList: LockedPersonallineData[]
}

class PersonalLineAllDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("PersonalLineAllData")
  }

  async request(context: PacketContext, _data: PersonalLineAllDataReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      curFinishedDailyTaskCount: 0,
      legendaryKeyCount: 0,
      ongoingPersonalLineList: [],
      canBeUnlockedPersonalLineList: [],
      lockedPersonalLineList: [],
    })
  }

  async response(context: PacketContext, data: PersonalLineAllDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PersonalLineAllDataPacket
export default (() => (packet = packet || new PersonalLineAllDataPacket()))()
