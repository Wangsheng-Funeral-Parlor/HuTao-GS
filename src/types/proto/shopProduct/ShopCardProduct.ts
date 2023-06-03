import { ResinCard } from "."

export interface ShopCardProduct {
  resinCard?: ResinCard

  productId: string
  priceTier: string
  mcoinBase: number
  hcoinPerDay: number
  days: number
  remainRewardDays?: number
  cardProductType: number
}
