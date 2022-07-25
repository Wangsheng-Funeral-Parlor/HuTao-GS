import Packet, { PacketContext, PacketInterface } from '#/packet'
import DungeonData from '$/gameData/data/DungeonData'
import SceneData from '$/gameData/data/SceneData'
import Vector from '$/utils/vector'
import { ClientStateEnum } from '@/types/enum'
import { RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'

export interface PlayerEnterDungeonReq {
  pointId: number
  dungeonId: number
}

export interface PlayerEnterDungeonRsp {
  retcode: RetcodeEnum
  pointId?: number
  dungeonId?: number
}

class PlayerEnterDungeonPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerEnterDungeon', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PlayerEnterDungeonReq): Promise<void> {
    const { player } = context
    const { currentWorld } = player
    const { pointId, dungeonId } = data

    const dungeonData = await DungeonData.getDungeon(dungeonId)
    const sceneData = await SceneData.getScene(dungeonData?.SceneId)
    if (!dungeonData || !sceneData) {
      await this.response(context, { retcode: RetcodeEnum.RET_DUNGEON_ENTER_FAIL })
      return
    }

    const scene = await currentWorld.getScene(dungeonData.SceneId)
    if (!scene) {
      await this.response(context, { retcode: RetcodeEnum.RET_DUNGEON_ENTER_FAIL })
      return
    }

    const { BornPos, BornRot } = sceneData

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(BornPos)
    rot.setData(BornRot)

    await scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_DUNGEON, SceneEnterReasonEnum.DUNGEON_ENTER)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      pointId,
      dungeonId
    })
  }

  async response(context: PacketContext, data: PlayerEnterDungeonRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PlayerEnterDungeonPacket
export default (() => packet = packet || new PlayerEnterDungeonPacket())()