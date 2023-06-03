import Packet, { PacketInterface, PacketContext } from "#/packet"
import Vector from "$/utils/vector"
import { KeepRotTypeEnum } from "@/types/enum"

export interface BeginCameraSceneLookNotify {
  customRadius?: number
  screenY: number
  Force: boolean
  RecoverKeepCurrent?: boolean
  otherParams?: string[]
  duration: number
  keepRotType?: KeepRotTypeEnum
  lookPos: Vector
  AllowInput: boolean
  ChangePlayMode: boolean
  entityId?: number
  ForceWalk: boolean
  screenX: number
  followPos: Vector
  FollowPos: boolean
  ScreenXY?: boolean
}

class BeginCameraSceneLookPacket extends Packet implements PacketInterface {
  constructor() {
    super("BeginCameraSceneLook")
  }

  async sendNotify(context: PacketContext, notifyData: BeginCameraSceneLookNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], notifyData: BeginCameraSceneLookNotify): Promise<void> {
    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: BeginCameraSceneLookPacket
export default (() => (packet = packet || new BeginCameraSceneLookPacket()))()
