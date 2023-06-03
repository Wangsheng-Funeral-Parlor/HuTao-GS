import Packet, { PacketContext, PacketInterface } from "#/packet"
import Vector from "$/utils/vector"
import { ClientStateEnum } from "@/types/enum"
import { WidgetCreateLocationInfo, WidgetCreatorInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface WidgetDoBagReq {
  locationInfo?: WidgetCreateLocationInfo
  widgetCreatorInfo?: WidgetCreatorInfo
  materialId: number
}

export interface WidgetDoBagRsp {
  retcode: RetcodeEnum
  materialId: number
}

class WidgetDoBagPacket extends Packet implements PacketInterface {
  constructor() {
    super("WidgetDoBag", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: WidgetDoBagReq): Promise<void> {
    const { materialId, widgetCreatorInfo } = data

    switch (materialId) {
      case 220026: {
        context.player.currentScene.vehicleManager.createVehicle(
          context.player,
          70500025,
          0,
          new Vector().setData(widgetCreatorInfo.locationInfo.pos),
          new Vector().setData(widgetCreatorInfo.locationInfo.rot)
        )
      }
      case 220047: {
        context.player.currentScene.vehicleManager.createVehicle(
          context.player,
          70800058,
          0,
          new Vector().setData(widgetCreatorInfo.locationInfo.pos),
          new Vector().setData(widgetCreatorInfo.locationInfo.rot)
        )
      }
      default: {
      }
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      materialId,
    })
  }

  async response(context: PacketContext, data: WidgetDoBagRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: WidgetDoBagPacket
export default (() => (packet = packet || new WidgetDoBagPacket()))()
