import Packet, { PacketContext, PacketInterface } from '#/packet'
import { STORE_LIMIT } from '$/player/inventory'
import { StoreTypeEnum } from '@/types/proto/enum'

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
    const { ALL, MATERIAL, WEAPON, RELIQUARY, FURNITURE } = STORE_LIMIT

    const notifyData: StoreWeightLimitNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      weightLimit: ALL,
      materialCountLimit: MATERIAL,
      weaponCountLimit: WEAPON,
      reliquaryCountLimit: RELIQUARY,
      furnitureCountLimit: FURNITURE
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: StoreWeightLimitPacket
export default (() => packet = packet || new StoreWeightLimitPacket())()