import Entity from "."

import { GRID_SIZE } from "$/manager/entityManager"
import Vector from "$/utils/vector"
import { MotionInfo } from "@/types/proto"
import { MotionStateEnum } from "@/types/proto/enum"

export default class Motion {
  entity: Entity

  pos: Vector
  rot: Vector
  speed: Vector
  state: MotionStateEnum
  params: Vector[]
  refPos: Vector
  refId: number
  intervalVelocity: number

  sceneTime: number
  reliableSeq: number

  lastSafePos: Vector
  lastSafeRot: Vector
  hasLastSafeState: boolean

  constructor(
    entity: Entity,
    pos: Vector = new Vector(0, 0, 0),
    rot: Vector = new Vector(0, 0, 0),
    speed: Vector = new Vector(0, 0, 0)
  ) {
    this.entity = entity

    pos.setGridSize(GRID_SIZE)

    this.pos = pos
    this.rot = rot
    this.speed = speed
    this.state = MotionStateEnum.MOTION_NONE
    this.params = []

    this.lastSafePos = new Vector(pos.x, pos.y, pos.z)
    this.lastSafeRot = new Vector(rot.x, rot.y, rot.z)
    this.hasLastSafeState = false
  }

  standby() {
    this.speed.set()
    this.state = MotionStateEnum.MOTION_STANDBY
  }

  distanceTo(motion: Motion) {
    return this.pos.distanceTo(motion.pos)
  }

  distanceTo2D(motion: Motion) {
    return this.pos.distanceTo2D(motion.pos)
  }

  copy(motion: Motion) {
    const { pos, rot, speed, lastSafePos, lastSafeRot, hasLastSafeState } = motion

    this.pos.copy(pos)
    this.rot.copy(rot)
    this.speed.copy(speed)

    this.lastSafePos.copy(lastSafePos)
    this.lastSafeRot.copy(lastSafeRot)
    this.hasLastSafeState = hasLastSafeState
  }

  update(motionInfo: MotionInfo, sceneTime?: number, reliableSeq?: number) {
    const { entity, state: oldState } = this
    const { pos, rot, speed, state } = motionInfo

    if (pos != null) this.pos.setData(pos)
    if (rot != null) this.rot.setData(rot)
    if (speed != null) this.speed.setData(speed)

    if (state != null) {
      this.state = state
      if (state !== oldState) entity.emit("MotionStateChanged", state, oldState)
    }

    if (sceneTime) this.sceneTime = sceneTime
    if (reliableSeq) this.reliableSeq = reliableSeq

    if (state !== MotionStateEnum.MOTION_STANDBY) return

    if (pos != null) this.lastSafePos.setData(pos)
    if (rot != null) this.lastSafeRot.setData(rot)
    if (pos != null || rot != null) this.hasLastSafeState = true
  }

  export(): MotionInfo {
    const { pos, rot, speed, state, params } = this

    return {
      pos: pos.export(),
      rot: rot.export(),
      speed: speed.export(),
      state,
      params: params.map((param) => param.export()),
    }
  }
}
