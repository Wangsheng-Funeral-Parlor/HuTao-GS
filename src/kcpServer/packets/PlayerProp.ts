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

  async sendNotify(context: PacketContext, type: number): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN, true)) return

    const value = context.player.props.get(type)
    const notifyData: PlayerPropNotify = {
      propMap: {
        [type]: {
          type,
          ival: value,
          val: value
        }
      }
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerPropPacket
export default (() => packet = packet || new PlayerPropPacket())()