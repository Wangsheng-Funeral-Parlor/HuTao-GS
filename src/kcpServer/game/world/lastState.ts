import Vector from '$/utils/vector'
import { SceneData } from '@/types/data/SceneData'
import { ClientState } from '@/types/enum/state'
import { LastStateUserData } from '@/types/user/WorldUserData'
import World from '.'

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
    const { currentScene, currentAvatar } = host
    if ((host.state & 0xF000) !== ClientState.IN_GAME || !host.isHost() || !currentScene || !currentAvatar) return false

    this.sceneId = currentScene.id

    const { motionInfo } = currentAvatar

    if (motionInfo.hasLastSafeState) {
      this.pos.copy(motionInfo.lastSafePos)
      this.rot.copy(motionInfo.lastSafeRot)
    } else {
      this.pos.copy(motionInfo.pos)
      this.rot.copy(motionInfo.rot)
    }

    return true
  }

  exportUserData(): LastStateUserData {
    this.saveState()

    const { sceneId, pos, rot } = this

    return {
      sceneId,
      pos: pos.export(),
      rot: rot.export()
    }
  }
}