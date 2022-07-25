import Packet, { PacketContext, PacketInterface } from '#/packet'
import { CylinderRegionSize, PolygonRegionSize, VectorInfo } from '@/types/proto'

export interface PlayerEyePointStateNotify {
  isUseEyePoint?: boolean
  eyePointPos?: VectorInfo
  regionEntityId?: number
  regionGroupId?: number
  regionConfigId?: number
  regionShape?: number
  isFilterStreamPos?: boolean

  // region_size
  sphereRadius?: number
  cubicSize?: VectorInfo
  cylinderSize?: CylinderRegionSize
  polygonSize?: PolygonRegionSize
}

class PlayerEyePointStatePacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerEyePointState')
  }

  async sendNotify(context: PacketContext, data: PlayerEyePointStateNotify): Promise<void> {
    await super.sendNotify(context, data)
  }
}

let packet: PlayerEyePointStatePacket
export default (() => packet = packet || new PlayerEyePointStatePacket())()