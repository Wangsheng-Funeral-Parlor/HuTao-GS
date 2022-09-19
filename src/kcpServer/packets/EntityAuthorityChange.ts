import Packet, { PacketContext, PacketInterface } from '#/packet'
import Entity from '$/entity'
import { AuthorityChange } from '@/types/proto'

export interface EntityAuthorityChangeNotify {
  authorityChangeList: AuthorityChange[]
}

class EntityAuthorityChangePacket extends Packet implements PacketInterface {
  entityList: Entity[]

  constructor() {
    super('EntityAuthorityChange')

    this.entityList = []
  }

  async sendNotify(context: PacketContext, entityList: Entity[]): Promise<void> {
    if (entityList.length <= 0) return

    const notifyData: EntityAuthorityChangeNotify = {
      authorityChangeList: entityList.map(entity => ({
        entityId: entity.entityId,
        authorityPeerId: entity.authorityPeerId,
        entityAuthorityInfo: entity.exportEntityAuthorityInfo()
      }))
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList, this.entityList.splice(0))
  }

  addEntity(entity: Entity) {
    const { entityList } = this
    if (!entityList.includes(entity)) entityList.push(entity)
  }
}

let packet: EntityAuthorityChangePacket
export default (() => packet = packet || new EntityAuthorityChangePacket())()