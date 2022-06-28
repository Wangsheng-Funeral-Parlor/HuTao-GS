import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { ActivityInfo } from '@/types/game/activity'

export interface ActivityInfoNotify {
  activityInfo: ActivityInfo
}

class ActivityInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('ActivityInfo')
  }

  async sendNotify(context: PacketContext, id: number): Promise<void> {
    await this.waitState(context, ClientState.LOGIN, true)

    const { game, player } = context
    const { activityManager } = game

    const activityInfo = activityManager.exportActivityInfo(player, id)
    if (activityInfo == null) return

    const notifyData: ActivityInfoNotify = {
      activityInfo
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: ActivityInfoPacket
export default (() => packet = packet || new ActivityInfoPacket())()