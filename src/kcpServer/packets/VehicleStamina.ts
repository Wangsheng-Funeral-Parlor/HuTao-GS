import Packet, { PacketContext, PacketInterface } from "#/packet"
import Vehicle from "$/entity/gadget/vehicle"

export interface VehicleStaminaNotify {
  entityId: number
  curStamina: number
}

class VehicleStaminaPacket extends Packet implements PacketInterface {
  constructor() {
    super("VehicleStamina")
  }

  async sendNotify(context: PacketContext, vehicle: Vehicle): Promise<void> {
    const { entityId, staminaManager } = vehicle
    const { curStamina } = staminaManager
    const notifyData: VehicleStaminaNotify = {
      entityId,
      curStamina: curStamina / 100,
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], vehicle: Vehicle): Promise<void> {
    await super.broadcastNotify(contextList, vehicle)
  }
}

let packet: VehicleStaminaPacket
export default (() => (packet = packet || new VehicleStaminaPacket()))()
