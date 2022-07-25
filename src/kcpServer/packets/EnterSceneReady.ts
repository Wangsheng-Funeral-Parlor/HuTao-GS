import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { RetcodeEnum, SceneEnterTypeEnum, VisionTypeEnum } from '@/types/proto/enum'
import EnterScenePeer from './EnterScenePeer'
import PlayerPreEnterMp from './PlayerPreEnterMp'
import SceneEntityDisappear from './SceneEntityDisappear'

export interface EnterSceneReadyReq {
  enterSceneToken: number
}

export interface EnterSceneReadyRsp {
  retcode: RetcodeEnum
  enterSceneToken?: number
}

class EnterSceneReadyPacket extends Packet implements PacketInterface {
  constructor() {
    super('EnterSceneReady', {
      reqWaitState: ClientStateEnum.ENTER_SCENE,
      reqWaitStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: EnterSceneReadyReq): Promise<void> {
    const { player, seqId } = context
    const { state, currentScene, missedEntityIdList } = player
    const { enterSceneToken: token, host } = currentScene
    const { enterSceneToken } = data

    if (enterSceneToken !== token) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    // Set client state
    player.state = ClientStateEnum.ENTER_SCENE | (state & 0x0F00) | ClientStateEnum.PRE_ENTER_SCENE_READY

    if (!player.isHost() && player.sceneEnterType === SceneEnterTypeEnum.ENTER_OTHER) {
      const hostCtx = host.context
      hostCtx.seqId = seqId

      await PlayerPreEnterMp.sendNotify(hostCtx, player)
    }

    await SceneEntityDisappear.sendNotify(context, missedEntityIdList.splice(0), VisionTypeEnum.VISION_MISS)
    await EnterScenePeer.sendNotify(context)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken
    })

    // Set client state
    player.state = ClientStateEnum.ENTER_SCENE | (state & 0x0F00) | ClientStateEnum.ENTER_SCENE_READY
  }

  async response(context: PacketContext, data: EnterSceneReadyRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EnterSceneReadyPacket
export default (() => packet = packet || new EnterSceneReadyPacket())()