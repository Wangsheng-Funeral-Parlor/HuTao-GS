import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { PropValue } from '@/types/game/prop'

export enum DataType {
  DATA_NONE = 0,
  WORLD_LEVEL = 1,
  IS_IN_MP_MODE = 2
}

export interface WorldDataNotify {
  worldPropMap: { [type: number]: PropValue }
}

class WorldDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE, false, 0xF000)) return

    const { level, mpMode } = context.player.currentWorld
    const isInMpMode = Number(mpMode)

    const notifyData: WorldDataNotify = {
      worldPropMap: {
        [DataType.WORLD_LEVEL]: {
          type: DataType.WORLD_LEVEL,
          ival: level,
          val: level
        },
        [DataType.IS_IN_MP_MODE]: {
          type: DataType.IS_IN_MP_MODE,
          ival: isInMpMode,
          val: isInMpMode
        }
      }
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: WorldDataPacket
export default (() => packet = packet || new WorldDataPacket())()