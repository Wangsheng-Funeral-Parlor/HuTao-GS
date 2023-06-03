import Packet, { PacketContext, PacketInterface } from "#/packet"
import Vector from "$/utils/vector"
import { VectorInfo } from "@/types/proto"

export interface HitTreeNotify {
  treeType: number
  treePos: VectorInfo
  dropPos: VectorInfo
}

class HitTreePacket extends Packet implements PacketInterface {
  constructor() {
    super("HitTree")
  }

  async recvNotify(context: PacketContext, data: HitTreeNotify): Promise<void> {
    const { player, seqId } = context
    const { currentScene } = player
    const { treeType, treePos, dropPos } = data

    if (currentScene == null || treeType == null || treePos == null) return

    const tree = new Vector()
    const drop = new Vector()

    tree.setData(treePos)
    drop.setData(dropPos)

    await currentScene.hitTree(player, treeType, tree, drop, seqId)
  }
}

let packet: HitTreePacket
export default (() => (packet = packet || new HitTreePacket()))()
