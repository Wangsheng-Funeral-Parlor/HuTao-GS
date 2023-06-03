import Packet, { PacketContext, PacketInterface } from "#/packet"
import { TowerCurLevelRecord, TowerFloorRecord, TowerMonthlyBrief } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import { getTimeSeconds } from "@/utils/time"

export interface TowerAllDataReq {
  isInteract?: boolean
}

export interface TowerAllDataRsp {
  retcode: RetcodeEnum
  towerScheduleId: number
  towerFloorRecordList: TowerFloorRecord[]
  dailyFloorId?: number
  dailyLevelIndex?: number
  curLevelRecord: TowerCurLevelRecord
  nextScheduleChangeTime: number
  floorOpenTimeMap: { [floor: number]: number }
  isFirstInteract?: boolean
  monthlyBrief?: TowerMonthlyBrief
  skipToFloorIndex?: number
  commemorativeRewardId?: number
  skipFloorGrantedRewardItemMap?: { [floor: number]: number }
  validTowerRecordNum?: number
  isFinishedEntranceFloor?: boolean
  scheduleStartTime: number
  lastScheduleMonthlyBrief?: TowerMonthlyBrief
}

class TowerAllDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("TowerAllData")
  }

  async request(context: PacketContext, _data: TowerAllDataReq): Promise<void> {
    const now = getTimeSeconds()

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      towerScheduleId: 0,
      towerFloorRecordList: [],
      curLevelRecord: {
        isEmpty: true,
      },
      nextScheduleChangeTime: now + 86400 * 31,
      floorOpenTimeMap: {},
      scheduleStartTime: now,
    })
  }

  async response(context: PacketContext, data: TowerAllDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: TowerAllDataPacket
export default (() => (packet = packet || new TowerAllDataPacket()))()
