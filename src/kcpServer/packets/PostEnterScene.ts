import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import GuestPostEnterScene from './GuestPostEnterScene'
import { ClientState } from '@/types/enum/state'

export interface PostEnterSceneReq {
  enterSceneToken: number
}

export interface PostEnterSceneRsp {
  retcode: RetcodeEnum
  enterSceneToken?: number
}

class PostEnterScenePacket extends Packet implements PacketInterface {
  constructor() {
    super('PostEnterScene', {
      reqWaitState: ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_DONE,
      reqWaitStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: PostEnterSceneReq): Promise<void> {
    const { player, seqId } = context
    const { state, currentWorld, currentScene } = player
    const { enterSceneToken } = data

    if (currentScene.enterSceneToken !== enterSceneToken) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.PRE_POST_ENTER_SCENE

    const hostCtx = currentWorld.host.context
    hostCtx.seqId = seqId

    if (!currentWorld.isHost(player)) await GuestPostEnterScene.sendNotify(hostCtx, currentScene, player)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken
    })

    // Set client state
    player.state = ClientState.IN_GAME | (state & 0x0F00) | ClientState.POST_ENTER_SCENE
  }

  async response(context: PacketContext, data: PostEnterSceneRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PostEnterScenePacket
export default (() => packet = packet || new PostEnterScenePacket())()