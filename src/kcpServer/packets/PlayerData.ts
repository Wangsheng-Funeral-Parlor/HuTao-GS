import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PropValue } from '@/types/proto'

export interface PlayerDataNotify {
  nickName: string
  serverTime: string
  isFirstLoginToday?: boolean
  regionId: number
  propMap: { [type: number]: PropValue }
}

class PlayerDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN)) return

    const { profile, props } = context.player
    const { nickname } = profile
    const notifyData: PlayerDataNotify = {
      nickName: nickname,
      serverTime: Date.now().toString(),
      regionId: 49,
      propMap: props.exportPropMap()
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerDataPacket
export default (() => packet = packet || new PlayerDataPacket())()