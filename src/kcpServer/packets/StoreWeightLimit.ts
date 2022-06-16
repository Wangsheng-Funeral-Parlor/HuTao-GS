import Packet, { PacketInterface, PacketContext } from '#/packet'
import { StoreTypeEnum } from '@/types/enum/player'

export interface StoreWeightLimitNotify {
  storeType: StoreTypeEnum
  weightLimit: number
  materialCountLimit: number
  weaponCountLimit: number
  reliquaryCountLimit: number
  furnitureCountLimit: number
}

class StoreWeightLimitPacket extends Packet implements PacketInterface {
  constructor() {
    super('StoreWeightLimit')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: StoreWeightLimitNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      weightLimit: 30000,
      materialCountLimit: 2000,
      weaponCountLimit: 2000,
      reliquaryCountLimit: 1500,
      furnitureCountLimit: 2000
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: StoreWeightLimitPacket
export default (() => packet = packet || new StoreWeightLimitPacket())()