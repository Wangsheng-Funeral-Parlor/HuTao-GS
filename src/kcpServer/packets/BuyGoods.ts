import ItemAddHint from "./ItemAddHint"

import Packet, { PacketInterface, PacketContext } from "#/packet"
import Material from "$/material"
import { ShopGoods } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface BuyGoodsReq {
  buyCount: number
  shopType: number
  goods: ShopGoods
}

export interface BuyGoodsRsp {
  retcode: RetcodeEnum
  buyCount: number
  goods: ShopGoods
  goodList?: ShopGoods[]
  shopType: number
}

class BuyGoodsPacket extends Packet implements PacketInterface {
  constructor() {
    super("BuyGoods")
  }

  async request(context: PacketContext, data: BuyGoodsReq): Promise<void> {
    const notifydata: BuyGoodsRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      buyCount: data.buyCount,
      goods: data.goods,
      shopType: data.shopType,
    }
    const buyItem = await Material.create(context.player, data.goods.goodsItem.itemId, data.buyCount)

    if (data.goods?.hcoin) {
      await context.player.removePrimogen(data.goods.hcoin * data.buyCount)
    } else if (data.goods?.mcoin) {
      await context.player.removeGenesisCrystal(data.goods.mcoin * data.buyCount)
    } else if (data.goods?.scoin) {
      await context.player.removeMora(data.goods.scoin * data.buyCount)
    } else {
      await context.player.inventory.remove(data.goods.costItemList[0].itemId, data.goods.costItemList[0].count)
    }

    await context.player.inventory.add(buyItem)

    await ItemAddHint.sendNotify(context, {
      itemList: [{ count: data.buyCount, itemId: data.goods.goodsItem.itemId, guid: buyItem.guid }],
      reason: 4, //enum?
    })
    await this.response(context, notifydata)
  }

  async response(context: PacketContext, data: BuyGoodsRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: BuyGoodsPacket
export default (() => (packet = packet || new BuyGoodsPacket()))()
