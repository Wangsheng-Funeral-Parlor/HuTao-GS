import Packet, { PacketInterface, PacketContext } from '#/packet'
import Entity from '$/entity'
import Npc from '$/entity/npc'
import { ProtEntityTypeEnum, VisionTypeEnum } from '@/types/enum/entity'
import { ClientState } from '@/types/enum/state'
import { SceneEntityInfo } from '@/types/game/entity'
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
    await this.waitState(context, ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE, true, 0xF0FF)

    const notifyData: SceneEntityAppearNotify = {
      entityList: entityList.map(entity => entity.exportSceneEntityInfo()),
      appearType
    }

    if (param != null) notifyData.param = param

    await super.sendNotify(context, notifyData)

    const npcList = entityList.filter(entity => entity.entityType === ProtEntityTypeEnum.PROT_ENTITY_NPC)
    if (npcList.length > 0) await GroupSuite.sendNotify(context, <Npc[]>npcList)

    if (appearType !== VisionTypeEnum.VISION_BORN) return
    for (let entity of entityList) await SceneEntityMove.sendNotify(context, entity)
  }
}

let packet: SceneEntityAppearPacket
export default (() => packet = packet || new SceneEntityAppearPacket())()