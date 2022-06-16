import Packet, { PacketInterface, PacketContext } from '#/packet'
import { MapAreaInfo } from '@/types/game/map'
import { RetcodeEnum } from '@/types/enum/retcode'
import MapAreaData from '$/gameData/data/MapAreaData'

export interface GetMapAreaReq { }

export interface GetMapAreaRsp {
  retcode: RetcodeEnum
  mapAreaInfoList: MapAreaInfo[]
}

class GetMapAreaPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetMapArea')
  }

  async request(context: PacketContext, _data: GetMapAreaReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      mapAreaInfoList: MapAreaData.getList().map(data => ({
        mapAreaId: data.Id,
        isOpen: true
      }))
    })
  }

  async response(context: PacketContext, data: GetMapAreaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetMapAreaPacket
export default (() => packet = packet || new GetMapAreaPacket())()