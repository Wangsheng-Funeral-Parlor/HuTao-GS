import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ProductPriceTier } from "@/types/proto"

export interface PlayerRechargeDataNotify {
  cardProductRemainDays?: number
  productPriceTierList: ProductPriceTier[]
}

class PlayerRechargeDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerRechargeData")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: PlayerRechargeDataNotify = {
      productPriceTierList: [
        {
          productId: "ys_glb_blessofmoon_tier5",
          priceTier: "Tier_5",
        },
        {
          productId: "ys_glb_bp_extra_tier20",
          priceTier: "Tier_20",
        },
        {
          productId: "ys_glb_bp_normal_tier10",
          priceTier: "Tier_10",
        },
        {
          productId: "ys_glb_bp_upgrade_tier12",
          priceTier: "Tier_12",
        },
        {
          productId: "ys_glb_primogem1ststall_tier1",
          priceTier: "Tier_1",
        },
        {
          productId: "ys_glb_primogem2ndstall_tier5",
          priceTier: "Tier_5",
        },
        {
          productId: "ys_glb_primogem3rdstall_tier15",
          priceTier: "Tier_15",
        },
        {
          productId: "ys_glb_primogem4thstall_tier30",
          priceTier: "Tier_30",
        },
        {
          productId: "ys_glb_primogem5thstall_tier50",
          priceTier: "Tier_50",
        },
        {
          productId: "ys_glb_primogem6thstall_tier60",
          priceTier: "Tier_60",
        },
      ],
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerRechargeDataPacket
export default (() => (packet = packet || new PlayerRechargeDataPacket()))()
