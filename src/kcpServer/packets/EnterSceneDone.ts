import PlayerEyePointState from "./PlayerEyePointState"

import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum, SceneEnterTypeEnum } from "@/types/proto/enum"

export interface EnterSceneDoneReq {
  enterSceneToken: number
}

export interface EnterSceneDoneRsp {
  retcode: RetcodeEnum
  enterSceneToken?: number
}

class EnterSceneDonePacket extends Packet implements PacketInterface {
  constructor() {
    super("EnterSceneDone", {
      reqWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.SCENE_INIT_FINISH,
      reqWaitStateMask: 0xf0ff,
      reqWaitStatePass: true,
    })
  }

  async request(context: PacketContext, data: EnterSceneDoneReq): Promise<void> {
    const { player, seqId } = context
    const { state, currentScene, sceneEnterType } = player
    const { enterSceneToken } = currentScene
    const { enterSceneToken: token } = data

    if (
      this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_ENTER_SCENE_DONE, true, 0xf0ff, false)
    ) {
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        enterSceneToken,
      })
      return
    }

    if (token !== enterSceneToken) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    // Set client state
    player.state = ClientStateEnum.ENTER_SCENE | (state & 0x0f00) | ClientStateEnum.PRE_ENTER_SCENE_DONE

    // Emit player join event
    await currentScene.emit("PlayerJoin", player, sceneEnterType, seqId)

    if (sceneEnterType !== SceneEnterTypeEnum.ENTER_GOTO && sceneEnterType !== SceneEnterTypeEnum.ENTER_GOTO_BY_PORTAL)
      await player.windyFileRce("enterNewScene")

    await PlayerEyePointState.sendNotify(context, {})

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken,
    })

    // Set client state
    player.state = ClientStateEnum.ENTER_SCENE | (state & 0x0f00) | ClientStateEnum.ENTER_SCENE_DONE
  }

  async response(context: PacketContext, data: EnterSceneDoneRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EnterSceneDonePacket
export default (() => (packet = packet || new EnterSceneDonePacket()))()
