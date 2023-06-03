import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"

export interface SceneTimeNotify {
  sceneId: number
  isPaused: boolean
  sceneTime: number
}

class SceneTimePacket extends Packet implements PacketInterface {
  constructor() {
    super("SceneTime")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE, true)) return

    const { id, sceneTime, paused } = context.player.currentScene

    const notifyData: SceneTimeNotify = {
      sceneId: id,
      isPaused: paused,
      sceneTime,
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: SceneTimePacket
export default (() => (packet = packet || new SceneTimePacket()))()
