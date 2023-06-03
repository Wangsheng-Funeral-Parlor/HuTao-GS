import Packet, { PacketContext, PacketInterface } from "#/packet"
import SceneData from "$/gameData/data/SceneData"
import { ClientStateEnum } from "@/types/enum"
import { PlayerWorldSceneInfo } from "@/types/proto"

export interface PlayerWorldSceneInfoListNotify {
  infoList: PlayerWorldSceneInfo[]
}

class PlayerWorldSceneInfoListPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerWorldSceneInfoList")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, false, 0xf0ff))
      return

    const { currentWorld } = context.player

    const sceneDataList = await SceneData.getSceneList()
    const infoList: PlayerWorldSceneInfo[] = []

    for (const sceneData of sceneDataList) {
      const { Id, IsMainScene } = sceneData
      if (!IsMainScene) continue

      const info = (await currentWorld.getScene(Id, false))?.exportSceneInfo()
      if (info == null) continue

      infoList.push(info)
    }

    const notifyData: PlayerWorldSceneInfoListNotify = { infoList }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerWorldSceneInfoListPacket
export default (() => (packet = packet || new PlayerWorldSceneInfoListPacket()))()
