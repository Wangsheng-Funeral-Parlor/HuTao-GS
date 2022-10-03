import Packet, { PacketInterface, PacketContext } from '#/packet'
import TrifleItem from '$/entity/gadget/trifleItem'
import Material from '$/material'
import Item from '$/player/inventory/item'
import { VectorInfo } from '@/types/proto'

export interface HitTreeNotify {
  treeType: number
  treePos: VectorInfo
  dropPos: VectorInfo
}

class HitTreePacket extends Packet implements PacketInterface {
  constructor() {
    super('HitTree')
  }

  async recvNotify(context: PacketContext, data: HitTreeNotify): Promise<void> {
    const { player, seqId } = context
    const { currentScene, pos } = player
    const { treeType, dropPos } = data

    if (currentScene == null || treeType == null) return
    const { entityManager } = currentScene

    const entity = new TrifleItem(new Item(await Material.create(player, 101300 + treeType))) // Don't have excel for this yet :(
    await entity.initNew()
    entity.motion.pos.setData(dropPos || pos)

    await entityManager.add(entity, undefined, undefined, seqId)
  }
}

let packet: HitTreePacket
export default (() => packet = packet || new HitTreePacket())()