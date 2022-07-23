import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { Shop } from '@/types/game/shop'

export interface GetShopReq {
  shopType: number
}

export interface GetShopRsp {
  retcode: RetcodeEnum
  shop?: Shop
}

class GetShopPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetShop', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: GetShopReq): Promise<void> {
    const { game, player } = context
    const { shopType } = data

    const shop = await game.shopManager.exportShop(shopType, player)

    if (shop == null) {
      await this.response(context, { retcode: RetcodeEnum.RET_SHOP_NOT_OPEN })
    } else {
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        shop
      })
    }
  }

  async response(context: PacketContext, data: GetShopRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetShopPacket
export default (() => packet = packet || new GetShopPacket())()