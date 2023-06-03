import Packet, { PacketInterface, PacketContext } from "#/packet"
import { GachaItem } from "@/types/proto"
import { GachaInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import { getJson } from "@/utils/json"

export interface DoGachaReq {
  gachaTag: string
  gachaScheduleId: number
  gachaType: number
  gachaRandom: number
  gachaTimes: number
}

export interface DoGachaRsp {
  leftGachaTimes: number
  gachaItemList: GachaItem[]
  gachaType: number
  newGachaRandom?: number
  wishProgress?: number
  wishMaxProgress?: number
  gachaTimes: number
  gachaTimesLimit?: number
  wishItemId?: number
  tenCostItemId: number
  costItemNum: number
  tenCostItemNum: number
  curScheduleDailyGachaTimes?: number
  costItemId: number
  gachaScheduleId: number
  dailyGahaTimes: number
  retcode: RetcodeEnum
}

class DoGachaPacket extends Packet implements PacketInterface {
  constructor() {
    super("DoGacha")
  }
  async request(context: PacketContext, data: DoGachaReq): Promise<void> {
    const gachaItemList: GachaItem[] = []
    const gachaInfoJson: GachaInfo[] = getJson("data/gachaInfo.json", [])

    for (let i = 0; i < 10; i++) {
      gachaItemList.push({
        isFlashCard: false,
        isGachaItemNew: false,
        gachaItem: {
          itemId:
            gachaInfoJson.find((item) => item.scheduleId === data.gachaScheduleId).gachaUpInfoList[0]?.itemIdList[0] ??
            1046, // Hutao
          count: 1,
        },
        tokenItemList: [],
      })
    }

    const notifydata: DoGachaRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      gachaScheduleId: data.gachaScheduleId,
      leftGachaTimes: 2147483647,
      gachaTimes: data.gachaTimes,
      gachaType: data.gachaType,
      dailyGahaTimes: data.gachaRandom,
      costItemNum: 1,
      costItemId: 223,
      tenCostItemNum: 10,
      tenCostItemId: 223,
      gachaItemList: gachaItemList,
    }
    await this.response(context, notifydata)
  }

  async response(context: PacketContext, data: DoGachaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: DoGachaPacket
export default (() => (packet = packet || new DoGachaPacket()))()
