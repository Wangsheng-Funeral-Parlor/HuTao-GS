import Packet, { PacketContext, PacketInterface } from "#/packet"
import Entity from "$/entity"
import { AbilityString } from "@/types/proto"
import { getStringHash } from "@/utils/hash"

export interface ServerGlobalValueChangeNotify {
  entityId: number
  value: string | number | boolean
  keyHash: number
}

class ServerGlobalValueChangePacket extends Packet implements PacketInterface {
  constructor() {
    super("ServerGlobalValueChange")
  }

  async sendNotify(context: PacketContext, entity: Entity, key: AbilityString): Promise<void> {
    const { entityId, abilityManager } = entity
    const { sgvDynamicValueMapContainer } = abilityManager

    const notifyData: ServerGlobalValueChangeNotify = {
      entityId,
      value: sgvDynamicValueMapContainer.getValue(key).val,
      keyHash: key.hash || getStringHash(key.str),
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], entity: Entity, key: AbilityString): Promise<void> {
    await super.broadcastNotify(contextList, entity, key)
  }
}

let packet: ServerGlobalValueChangePacket
export default (() => (packet = packet || new ServerGlobalValueChangePacket()))()
