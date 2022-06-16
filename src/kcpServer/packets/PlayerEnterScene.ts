import Packet, { PacketInterface, PacketContext } from '#/packet'
import { SceneEnterTypeEnum } from '@/types/enum/scene'
import { VectorInterface } from '@/types/game/motion'

export interface PlayerEnterSceneNotify {
  sceneId: number
  pos: VectorInterface
  sceneBeginTime: string
  type: SceneEnterTypeEnum
  targetUid: number
  prevSceneId?: number
  prevPos?: VectorInterface
  dungeonId?: number
  worldLevel: number
  enterSceneToken: number
  isFirstLoginEnterScene?: boolean
  sceneTagIdList: number[]
  isSkipUi?: boolean
  enterReason: number
  worldType: number
  sceneTransaction: string
}

class PlayerEnterScenePacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerEnterScene')
  }

  async sendNotify(context: PacketContext, data: PlayerEnterSceneNotify): Promise<void> {
    await super.sendNotify(context, data)
  }
}

let packet: PlayerEnterScenePacket
export default (() => packet = packet || new PlayerEnterScenePacket())()