import Packet, { PacketInterface, PacketContext } from '#/packet'
import SceneData from '$/gameData/data/SceneData'
import DungeonEntry from '@/types/gameData/BinOutput/ScenePoint/Point/DungeonEntry'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { DungeonEntryInfo } from '@/types/game/dungeon'

export interface DungeonEntryInfoReq {
  pointId: number
  sceneId: number
}

export interface DungeonEntryInfoRsp {
  retcode: RetcodeEnum
  pointId: number
  dungeonEntryList: DungeonEntryInfo[]
  recommendDungeonId?: number
}

class DungeonEntryInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('DungeonEntryInfo', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: DungeonEntryInfoReq): Promise<void> {
    const { currentScene } = context.player
    const { pointId } = data
    const dungeonEntryList: DungeonEntryInfo[] = []

    const dungeonEntryData = await SceneData.getScenePoint(currentScene.id, pointId) as DungeonEntry
    if (dungeonEntryData && dungeonEntryData.DungeonIds) {
      for (let id of dungeonEntryData.DungeonIds) {
        dungeonEntryList.push({
          dungeonId: id
        })
      }
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      pointId,
      dungeonEntryList
    })
  }

  async response(context: PacketContext, data: DungeonEntryInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: DungeonEntryInfoPacket
export default (() => packet = packet || new DungeonEntryInfoPacket())()