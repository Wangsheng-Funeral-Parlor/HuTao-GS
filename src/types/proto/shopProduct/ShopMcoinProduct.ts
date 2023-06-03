export interface ShopMcoinProduct {
  productId: string
  priceTier: string
  mcoinBase: number
  mcoinNonFirst: number
  mcoinFirst: number
  boughtNum?: number
  isAudit?: boolean
}
