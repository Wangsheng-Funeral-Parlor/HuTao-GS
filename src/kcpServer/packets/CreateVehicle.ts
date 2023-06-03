import Packet, { PacketContext, PacketInterface } from "#/packet"
import Vector from "$/utils/vector"
import { ClientStateEnum } from "@/types/enum"
import { VectorInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface CreateVehicleReq {
  vehicleId: number
  scenePointId: number
  pos: VectorInfo
  rot: VectorInfo
}

export interface CreateVehicleRsp {
  retcode: RetcodeEnum
  vehicleId: number
  entityId: number
}

class CreateVehiclePacket extends Packet implements PacketInterface {
  constructor() {
    super("CreateVehicle", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: CreateVehicleReq): Promise<void> {
    const { player } = context
    const { currentScene } = player
    const { vehicleManager } = currentScene
    const { vehicleId, scenePointId, pos, rot } = data

    const entity = await vehicleManager.createVehicle(
      player,
      vehicleId,
      scenePointId,
      new Vector().setData(pos),
      new Vector().setData(rot)
    )

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      vehicleId,
      entityId: entity.entityId,
    })
  }

  async response(context: PacketContext, data: CreateVehicleRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: CreateVehiclePacket
export default (() => (packet = packet || new CreateVehiclePacket()))()
