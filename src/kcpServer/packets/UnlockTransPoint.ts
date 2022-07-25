import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import ScenePointUnlock from './ScenePointUnlock'

export interface UnlockTransPointReq {
  sceneId: number
  pointId: number
}

export interface UnlockTransPointRsp {
  retcode: RetcodeEnum
}

class UnlockTransPointPacket extends Packet implements PacketInterface {
  constructor() {
    super('UnlockTransPoint')
  }

  async request(context: PacketContext, data: UnlockTransPointReq): Promise<void> {
    const { player } = context
    const { currentWorld } = player
    const { sceneId, pointId } = data

    if (!player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_NOT_IN_SELF_SCENE })
      return
    }

    const scene = await currentWorld.getScene(sceneId, false)
    if (!scene) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
      return
    }

    if (!scene.unlockPoint(pointId)) {
      await this.response(context, { retcode: RetcodeEnum.RET_POINT_ALREAY_UNLOCKED })
      return
    }

    await ScenePointUnlock.broadcastNotify(currentWorld.broadcastContextList, scene)

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: UnlockTransPointRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: UnlockTransPointPacket
export default (() => packet = packet || new UnlockTransPointPacket())()