import Packet, { PacketInterface, PacketContext } from '#/packet'
import { VectorInterface } from '@/types/game/motion';
import { CylinderRegionSize, PolygonRegionSize } from '@/types/game/regionSize';

export interface PlayerEyePointStateNotify {
  isUseEyePoint?: boolean
  eyePointPos?: VectorInterface
  regionEntityId?: number
  regionGroupId?: number
  regionConfigId?: number
  regionShape?: number
  isFilterStreamPos?: boolean

  // region_size
  sphereRadius?: number
  cubicSize?: VectorInterface
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