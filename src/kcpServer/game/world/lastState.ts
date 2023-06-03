import World from "."

import Vector from "$/utils/vector"
import { ClientStateEnum } from "@/types/enum"
import { SceneData } from "@/types/gameData/SceneData"
import { LastStateUserData } from "@/types/user/WorldUserData"

export default class LastState {
  world: World

  sceneId: number
  pos: Vector
  rot: Vector

  constructor(world: World) {
    this.world = world

    this.sceneId = 0
    this.pos = new Vector()
    this.rot = new Vector()
  }

  init(userData: LastStateUserData) {
    const { sceneId, pos, rot } = userData

    this.sceneId = sceneId
    this.pos.setData(pos)
    this.rot.setData(rot)
  }

  initNew(sceneData: SceneData) {
    const { pos, rot } = this
    const { Id, BornPos, BornRot } = sceneData

    this.sceneId = Id
    pos.setData(BornPos)
    rot.setData(BornRot)
  }

  saveState() {
    const { host } = this.world
    const { currentScene, pos, rot, hasLastSafeState, lastSafePos, lastSafeRot } = host
    if ((host.state & 0xf000) !== ClientStateEnum.IN_GAME || !host.isHost() || !currentScene) return false

    this.sceneId = currentScene.id

    if (hasLastSafeState) {
      this.pos.copy(lastSafePos)
      this.rot.copy(lastSafeRot)
    } else if (pos && rot) {
      this.pos.copy(pos)
      this.rot.copy(rot)
    }

    return true
  }

  exportUserData(): LastStateUserData {
    this.saveState()

    const { sceneId, pos, rot } = this

    return {
      sceneId,
      pos: pos.export(),
      rot: rot.export(),
    }
  }
}
