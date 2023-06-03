import Packet, { PacketContext, PacketInterface } from "#/packet"
import MapAreaData from "$/gameData/data/MapAreaData"
import { MapAreaInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface GetMapAreaReq {}

export interface GetMapAreaRsp {
  retcode: RetcodeEnum
  mapAreaInfoList: MapAreaInfo[]
}

class GetMapAreaPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetMapArea")
  }

  async request(context: PacketContext, _data: GetMapAreaReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      mapAreaInfoList: (
        await MapAreaData.getMapAreaList()
      ).map((data) => ({
        mapAreaId: data.Id,
        isOpen: true,
      })),
    })
  }

  async response(context: PacketContext, data: GetMapAreaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetMapAreaPacket
export default (() => (packet = packet || new GetMapAreaPacket()))()
