import Packet, { PacketContext, PacketInterface } from "#/packet"
import SceneData from "$/gameData/data/SceneData"
import DungeonEntry from "$DT/BinOutput/Config/ConfigScenePoint/Child/DungeonEntry"
import { ClientStateEnum } from "@/types/enum"
import { DungeonEntryInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

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
    super("DungeonEntryInfo", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: DungeonEntryInfoReq): Promise<void> {
    const { currentScene } = context.player
    const { pointId } = data
    const dungeonEntryList: DungeonEntryInfo[] = []

    const dungeonEntryData = <DungeonEntry>await SceneData.getScenePoint(currentScene.id, pointId)

    if (dungeonEntryData && dungeonEntryData.DungeonIds) {
      for (const id of dungeonEntryData.DungeonIds) {
        dungeonEntryList.push({
          dungeonId: id,
        })
      }
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      pointId,
      dungeonEntryList,
    })
  }

  async response(context: PacketContext, data: DungeonEntryInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: DungeonEntryInfoPacket
export default (() => (packet = packet || new DungeonEntryInfoPacket()))()
