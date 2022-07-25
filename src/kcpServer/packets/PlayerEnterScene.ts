import Packet, { PacketContext, PacketInterface } from '#/packet'
import { VectorInfo } from '@/types/proto'
import { SceneEnterTypeEnum } from '@/types/proto/enum'

export interface PlayerEnterSceneNotify {
  sceneId: number
  pos: VectorInfo
  sceneBeginTime: string
  type: SceneEnterTypeEnum
  targetUid: number
  prevSceneId?: number
  prevPos?: VectorInfo
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