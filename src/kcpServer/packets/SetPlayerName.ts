import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import ScenePlayerInfo from './ScenePlayerInfo'
import SceneTeamUpdate from './SceneTeamUpdate'
import WorldPlayerInfo from './WorldPlayerInfo'
import { ClientStateEnum } from '@/types/enum'

export interface SetPlayerNameReq {
  nickName: string
}

export interface SetPlayerNameRsp {
  retcode: RetcodeEnum
  nickName?: string
}

class SetPlayerNamePacket extends Packet implements PacketInterface {
  constructor() {
    super('SetPlayerName', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetPlayerNameReq): Promise<void> {
    const { player, seqId } = context
    const { profile, currentScene } = player
    const { nickName } = data
    const newName = nickName.trim()

    if (newName.length === 0) {
      await this.response(context, { retcode: RetcodeEnum.RET_NICKNAME_IS_EMPTY })
      return
    }

    if (/\s/.test(newName)) {
      await this.response(context, { retcode: RetcodeEnum.RET_NICKNAME_WORD_ILLEGAL })
      return
    }

    profile.nickname = newName

    if (player.isInMp()) {
      const { broadcastContextList } = currentScene
      for (const broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await WorldPlayerInfo.broadcastNotify(broadcastContextList)
      await ScenePlayerInfo.broadcastNotify(broadcastContextList)
      await SceneTeamUpdate.broadcastNotify(broadcastContextList)
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      nickName: profile.nickname
    })
  }

  async response(context: PacketContext, data: SetPlayerNameRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerNamePacket
export default (() => packet = packet || new SetPlayerNamePacket())()