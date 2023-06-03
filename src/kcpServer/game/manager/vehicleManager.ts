import Vehicle from "$/entity/gadget/vehicle"
import Player from "$/player"
import Scene from "$/scene"
import Vector from "$/utils/vector"
import { VehicleLocationInfo } from "@/types/proto"

export default class VehicleManager {
  scene: Scene

  vehicleList: Vehicle[]

  constructor(scene: Scene) {
    this.scene = scene

    this.vehicleList = []
  }

  async destroy() {
    while (this.vehicleList.length > 0) await this.destroyVehicle(this.vehicleList.shift())
  }

  getVehicle(entityId: number): Vehicle {
    return this.vehicleList.find((v) => v.entityId === entityId)
  }

  getVehicleByOwner(player: Player): Vehicle {
    return this.vehicleList.find((v) => v.player === player)
  }

  async createVehicle(player: Player, vehicleId: number, pointId: number, pos: Vector, rot: Vector): Promise<Vehicle> {
    const { scene, vehicleList } = this
    const { entityManager } = scene
    const { currentVehicle } = player
    if (currentVehicle) await currentVehicle.destroy()

    const entity = new Vehicle(this, player, vehicleId, pointId)

    entity.motion.pos.copy(pos)
    entity.motion.rot.copy(rot)

    await entity.initNew(90)
    await entityManager.add(entity)

    vehicleList.push(entity)
    player.currentVehicle = entity

    return entity
  }

  async destroyVehicle(vehicle: Vehicle) {
    const { vehicleList } = this
    const { vehicleManager, manager, player } = vehicle

    if (vehicleManager !== this) return

    if (manager) await manager.unregister(vehicle)
    if (vehicleList.includes(vehicle)) vehicleList.splice(vehicleList.indexOf(vehicle), 1)

    player.currentVehicle = null
  }

  exportVehicleLocationInfoList(): VehicleLocationInfo[] {
    return this.vehicleList.map((v) => v.exportVehicleLocationInfo())
  }
}
