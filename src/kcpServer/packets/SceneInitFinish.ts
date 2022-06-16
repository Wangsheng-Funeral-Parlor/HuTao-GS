import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import AllMarkPoint from './AllMarkPoint'
import HostPlayer from './HostPlayer'
import PlayerEnterSceneInfo from './PlayerEnterSceneInfo'
import PlayerGameTime from './PlayerGameTime'
import PlayerWorldSceneInfoList from './PlayerWorldSceneInfoList'
import ScenePlayBattleInfoList from './ScenePlayBattleInfoList'
import ScenePlayerInfo from './ScenePlayerInfo'
import SceneTeamUpdate from './SceneTeamUpdate'
import SceneTime from './SceneTime'
import SyncScenePlayTeamEntity from './SyncScenePlayTeamEntity'
import SyncTeamEntity from './SyncTeamEntity'
import WorldData from './WorldData'
import WorldPlayerInfo from './WorldPlayerInfo'
import ServerTime from './ServerTime'
import SceneForceUnlock from './SceneForceUnlock'
import ChatChannel from '$/chat/chatChannel'
import { SystemHintTypeEnum } from '@/types/enum/chat'
import { SceneEnterTypeEnum } from '@/types/enum/scene'
import { ClientState } from '@/types/enum/state'

export interface SceneInitFinishReq {
  enterSceneToken: number
}

export interface SceneInitFinishRsp {
  retcode: RetcodeEnum
  enterSceneToken?: number
}

class SceneInitFinishPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneInitFinish', {
      reqWaitState: ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_READY,
      reqWaitStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: SceneInitFinishReq): Promise<void> {
    const { game, player, seqId } = context
    const { state, currentWorld, currentScene } = player
    const { enterSceneToken: targetEnterSceneToken, broadcastContextList } = currentScene
    const { enterSceneToken } = data

    if (targetEnterSceneToken !== enterSceneToken) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_TOKEN_INVALID })
      return
    }

    for (let broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.PRE_SCENE_INIT_FINISH

    await ServerTime.sendNotify(context)
    await WorldPlayerInfo.broadcastNotify(broadcastContextList)
    await WorldData.sendNotify(context)
    await PlayerWorldSceneInfoList.sendNotify(context)
    await SceneForceUnlock.sendNotify(context)

    await HostPlayer.sendNotify(context)

    // Send mp join system hint
    if (!player.isHost() && player.sceneEnterType === SceneEnterTypeEnum.ENTER_OTHER) {
      await game.chatManager.sendPublic(currentWorld, 0, ChatChannel.createSystemHint(player, SystemHintTypeEnum.CHAT_ENTER_WORLD), seqId)
    }

    await SceneTime.broadcastNotify(broadcastContextList)
    await PlayerGameTime.broadcastNotify(broadcastContextList)
    await ScenePlayerInfo.broadcastNotify(broadcastContextList)
    await PlayerEnterSceneInfo.sendNotify(context)
    await SceneTeamUpdate.broadcastNotify(broadcastContextList)

    await SyncTeamEntity.broadcastNotify(broadcastContextList)
    await SyncScenePlayTeamEntity.broadcastNotify(broadcastContextList)
    await ScenePlayBattleInfoList.sendNotify(context)

    await AllMarkPoint.sendNotify(context)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      enterSceneToken
    })

    // Set client state
    player.state = ClientState.ENTER_SCENE | (state & 0x0F00) | ClientState.SCENE_INIT_FINISH
  }

  async response(context: PacketContext, data: SceneInitFinishRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SceneInitFinishPacket
export default (() => packet = packet || new SceneInitFinishPacket())()