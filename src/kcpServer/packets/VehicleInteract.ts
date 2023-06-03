import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { VehicleMember } from "@/types/proto"
import { RetcodeEnum, VehicleInteractTypeEnum } from "@/types/proto/enum"

export interface VehicleInteractReq {
  entityId: number
  interactType: VehicleInteractTypeEnum
  pos: number
}

export interface VehicleInteractRsp {
  retcode: RetcodeEnum
  entityId?: number
  interactType?: VehicleInteractTypeEnum
  member?: VehicleMember
}

class VehicleInteractPacket extends Packet implements PacketInterface {
  constructor() {
    super("VehicleInteract", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: VehicleInteractReq): Promise<void> {
    const { player } = context
    const { currentScene } = player
    const { vehicleManager } = currentScene
    const { entityId, interactType, pos } = data

    const vehicle = vehicleManager.getVehicle(entityId)
    if (vehicle == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })
      return
    }

    switch (interactType) {
      case VehicleInteractTypeEnum.VEHICLE_INTERACT_IN:
        await vehicle.addPassenger(player, pos, context)
        break
      case VehicleInteractTypeEnum.VEHICLE_INTERACT_OUT:
        await vehicle.removePassenger(player, context)
        break
      default:
        await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
    }
  }

  async response(context: PacketContext, data: VehicleInteractRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: VehicleInteractPacket
export default (() => (packet = packet || new VehicleInteractPacket()))()
