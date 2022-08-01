import ShopData from '$/gameData/data/ShopData'
import Player from '$/player'
import { ShopData as ShopDataType } from '@/types/gameData/ShopData'
import { Shop, ShopCardProduct, ShopGoods } from '@/types/proto'
import { getTimeSeconds } from '@/utils/time'
import Game from '..'

const cardShopProducts: ShopCardProduct[] = [
  {
    productId: 'ys_glb_blessofmoon_tier5',
    priceTier: 'Tier_5',
    mcoinBase: 300,
    hcoinPerDay: 90,
    days: 30,
    cardProductType: 1
  }
]

export default class ShopManager {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  private calcNextRefresh(data: ShopDataType): number | null {
    const d = new Date()

    d.setHours(4)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)

    switch (data?.RefreshType) {
      case 'SHOP_REFRESH_DAILY':
        d.setDate(d.getDate() + 1)
        break
      case 'SHOP_REFRESH_WEEKLY':
        d.setDate(d.getDate() + ((7 - d.getDay()) % 7))
        break
      case 'SHOP_REFRESH_MONTHLY':
        d.setDate(1)
        d.setMonth(d.getMonth() + 1)
        break
      default:
        return null
    }

    return getTimeSeconds(d)
  }

  async getNextRefresh(shopType: number): Promise<number | null> {
    const dataList = await ShopData.getShopGoods(shopType)
    return this.calcNextRefresh(dataList.find(data => data.RefreshType != null))
  }

  async exportGoodsList(shopType: number, _player: Player): Promise<ShopGoods[]> {
    const dataList = await ShopData.getShopGoods(shopType)
    const now = getTimeSeconds()

    const goodsList: ShopGoods[] = []
    for (const data of dataList) {
      if (data.EndTime <= now) continue

      goodsList.push(<ShopGoods>Object.fromEntries(Object.entries(<ShopGoods>{
        goodsId: data.Id,
        goodsItem: {
          itemId: data.ItemId,
          count: data.ItemCount
        },
        scoin: data.CostScoin,
        hcoin: data.CostHcoin,
        costItemList: data.CostItems.map(item => ({
          itemId: item.Id,
          count: item.Count
        })),
        //boughtNum: 0,
        buyLimit: data.BuyLimit,
        beginTime: data.BeginTime,
        endTime: data.EndTime,
        nextRefreshTime: await this.getNextRefresh(shopType),
        minLevel: data.MinPlayerLevel,
        maxLevel: data.MaxPlayerLevel,
        preGoodsIdList: [],
        mcoin: data.CostMcoin,
        secondarySheetId: data.SecondarySheetId
      }).filter(e => e[1] != null)))
    }

    return goodsList
  }

  async exportShop(shopType: number, player: Player): Promise<Shop> {
    switch (shopType) {
      case 900:
        return {
          shopType,
          cardProductList: cardShopProducts
        }
      case 903:
        return null
      default: {
        const nextRefresh = await this.getNextRefresh(shopType)
        return nextRefresh != null ? {
          shopType,
          goodsList: await this.exportGoodsList(shopType, player),
          nextRefreshTime: nextRefresh
        } : {
          shopType,
          goodsList: await this.exportGoodsList(shopType, player)
        }
      }
    }
  }
}