import Packet, { PacketContext, PacketInterface } from '#/packet'
import Entity from '$/entity'
import Npc from '$/entity/npc'
import { ClientStateEnum, EntityTypeEnum } from '@/types/enum'
import { SceneEntityInfo } from '@/types/proto'
import { VisionTypeEnum } from '@/types/proto/enum'
import GroupSuite from './GroupSuite'
import SceneEntityMove from './SceneEntityMove'

export interface SceneEntityAppearNotify {
  entityList: SceneEntityInfo[]
  appearType: VisionTypeEnum
  param?: number
}

class SceneEntityAppearPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneEntityAppear')
  }

  async sendNotify(context: PacketContext, entityList: Entity[], appearType: VisionTypeEnum, param?: number): Promise<void> {
    await this.waitState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_ENTER_SCENE_DONE, true, 0xF0FF)

    const notifyData: SceneEntityAppearNotify = {
      entityList: entityList
        .filter(entity => !entity.isDead())
        .map(entity => entity.exportSceneEntityInfo()),
      appearType
    }

    if (param != null) notifyData.param = param

    await super.sendNotify(context, notifyData)

    const npcList = entityList.filter(entity => entity.entityType === EntityTypeEnum.NPC)
    if (npcList.length > 0) await GroupSuite.sendNotify(context, <Npc[]>npcList)

    if (appearType !== VisionTypeEnum.VISION_BORN) return
    for (const entity of entityList) await SceneEntityMove.sendNotify(context, entity)
  }
}

let packet: SceneEntityAppearPacket
export default (() => packet = packet || new SceneEntityAppearPacket())()