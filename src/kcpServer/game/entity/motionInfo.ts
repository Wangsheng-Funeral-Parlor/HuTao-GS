import Vector from '$/utils/vector'
import { MotionStateEnum } from '@/types/enum/entity'
import { MotionInfoInterface } from '@/types/game/motion'

export default class MotionInfo {
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
    pos: Vector = new Vector(0, 0, 0),
    rot: Vector = new Vector(0, 0, 0),
    speed: Vector = new Vector(0, 0, 0)
  ) {
    this.pos = pos
    this.rot = rot
    this.speed = speed
    this.state = MotionStateEnum.MOTION_NONE

    this.lastSafePos = new Vector(pos.X, pos.Y, pos.Z)
    this.lastSafeRot = new Vector(rot.X, rot.Y, rot.Z)
    this.hasLastSafeState = false
  }

  distanceTo(motionInfo: MotionInfo) {
    return this.pos.distanceTo(motionInfo.pos)
  }

  copy(motionInfo: MotionInfo) {
    const { pos, rot, speed, lastSafePos, lastSafeRot, hasLastSafeState } = motionInfo

    this.pos.copy(pos)
    this.rot.copy(rot)
    this.speed.copy(speed)

    this.lastSafePos.copy(lastSafePos)
    this.lastSafeRot.copy(lastSafeRot)
    this.hasLastSafeState = hasLastSafeState
  }

  update(motionInfo: MotionInfoInterface, sceneTime?: number, reliableSeq?: number) {
    const { pos, rot, speed, state } = motionInfo

    if (pos != null) this.pos.setData(pos)
    if (rot != null) this.rot.setData(rot)
    if (speed != null) this.speed.setData(speed)

    if (state != null) this.state = state

    if (sceneTime) this.sceneTime = sceneTime
    if (reliableSeq) this.reliableSeq = reliableSeq

    if (pos && state === MotionStateEnum.MOTION_STANDBY) {
      if (pos != null) this.lastSafePos.setData(pos)
      if (rot != null) this.lastSafeRot.setData(rot)
      if (pos != null || rot != null) this.hasLastSafeState = true
    }
  }

  export(): MotionInfoInterface {
    const { pos, rot, speed, state } = this

    return {
      pos: pos.export(),
      rot: rot.export(),
      speed: speed.export(),
      state
    }
  }
}