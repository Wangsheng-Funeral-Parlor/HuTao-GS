import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PropValue } from '@/types/proto'

export interface PlayerPropNotify {
  propMap: { [type: number]: PropValue }
}

class PlayerPropPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerProp')
  }

  async sendNotify(context: PacketContext, ...types: number[]): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN, true)) return

    const notifyData: PlayerPropNotify = {
      propMap: Object.fromEntries(types.map(type => {
        const value = context.player.props.get(type)
        return [
          type,
          {
            type,
            ival: value,
            val: value
          }
        ]
      }))
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerPropPacket
export default (() => packet = packet || new PlayerPropPacket())()