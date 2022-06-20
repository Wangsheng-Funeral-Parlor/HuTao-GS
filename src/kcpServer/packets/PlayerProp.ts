import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { PropValue } from '@/types/game/prop'

export interface PlayerPropNotify {
  propMap: { [type: number]: PropValue }
}

class PlayerPropPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerProp')
  }

  async sendNotify(context: PacketContext, ...types: number[]): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN, true)) return

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