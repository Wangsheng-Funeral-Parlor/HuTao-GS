import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import EnterScenePeer from './EnterScenePeer'
import { ClientState } from '@/types/enum/state'
import PlayerPreEnterMp from './PlayerPreEnterMp'
import { SceneEnterTypeEnum } from '@/types/enum/scene'
import SceneEntityDisappear from './SceneEntityDisappear'
import { VisionTypeEnum } from '@/types/enum/entity'

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
      reqWaitState: ClientState.ENTER_SCENE,
      reqWaitStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: EnterSceneReadyReq): Promise<void> {
    const { player, seqId } = context
    const { state, currentScene, loadedEntityIdList } = player
    const { enterSceneToken } = data

    if (currentScene.enterSceneToken !== enterSceneToken) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.PRE_ENTER_SCENE_READY

    if (!player.isHost() && player.sceneEnterType === SceneEnterTypeEnum.ENTER_OTHER) {
      const hostCtx = currentScene.host.context
      hostCtx.seqId = seqId

      await PlayerPreEnterMp.sendNotify(hostCtx, player)
    }

    if (loadedEntityIdList.length > 0) await SceneEntityDisappear.sendNotify(context, loadedEntityIdList.splice(0), VisionTypeEnum.VISION_MISS)

    await EnterScenePeer.sendNotify(context)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken
    })

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.ENTER_SCENE_READY
  }

  async response(context: PacketContext, data: EnterSceneReadyRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EnterSceneReadyPacket
export default (() => packet = packet || new EnterSceneReadyPacket())()