import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ActivityScheduleInfo } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetActivityScheduleReq { }

export interface GetActivityScheduleRsp {
  retcode: RetcodeEnum
  activityScheduleList: ActivityScheduleInfo[]
  remainFlySeaLampNum?: number
}

class GetActivitySchedulePacket extends Packet implements PacketInterface {
  constructor() {
    super('GetActivitySchedule')
  }

  async request(context: PacketContext, _data: GetActivityScheduleReq): Promise<void> {
    const { game } = context

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      activityScheduleList: game.activityManager.exportActivityScheduleInfoList()
    })
  }

  async response(context: PacketContext, data: GetActivityScheduleRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetActivitySchedulePacket
export default (() => packet = packet || new GetActivitySchedulePacket())()