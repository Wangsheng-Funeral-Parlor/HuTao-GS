import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ClientCollectorData, OneoffGatherPointDetectorData, WidgetCameraInfo, WidgetCreateLocationInfo, WidgetCreatorInfo, WidgetThunderBirdFeatherInfo } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface QuickUseWidgetReq {
  locationInfo?: WidgetCreateLocationInfo
  cameraInfo?: WidgetCameraInfo
  creatorInfo?: WidgetCreatorInfo
  thunderBirdFeatherInfo?: WidgetThunderBirdFeatherInfo
}

export interface QuickUseWidgetRsp {
  retcode: RetcodeEnum
  materialId?: number
  detectorData?: OneoffGatherPointDetectorData
  clientCollectorData?: ClientCollectorData
}

class QuickUseWidgetPacket extends Packet implements PacketInterface {
  constructor() {
    super('QuickUseWidget', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: QuickUseWidgetReq): Promise<void> {
    console.log(data)
    await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
  }

  async response(context: PacketContext, data: QuickUseWidgetRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: QuickUseWidgetPacket
export default (() => packet = packet || new QuickUseWidgetPacket())()