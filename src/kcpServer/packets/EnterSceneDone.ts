import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface EnterSceneDoneReq {
  enterSceneToken: number
}

export interface EnterSceneDoneRsp {
  retcode: RetcodeEnum
  enterSceneToken?: number
}

class EnterSceneDonePacket extends Packet implements PacketInterface {
  constructor() {
    super('EnterSceneDone', {
      reqWaitState: ClientState.ENTER_SCENE | ClientState.SCENE_INIT_FINISH,
      reqWaitStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: EnterSceneDoneReq): Promise<void> {
    const { player, seqId } = context
    const { state, currentScene } = player
    const { entityManager, enterSceneToken } = currentScene
    const { enterSceneToken: token } = data

    if (token !== enterSceneToken) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.PRE_ENTER_SCENE_DONE

    // Add current avatar to scene
    await entityManager.add(player.currentAvatar, undefined, undefined, true, seqId)

    // Force entity update
    await entityManager.updatePlayer(player, true, seqId)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken
    })

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.ENTER_SCENE_DONE
  }

  async response(context: PacketContext, data: EnterSceneDoneRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EnterSceneDonePacket
export default (() => packet = packet || new EnterSceneDonePacket())()