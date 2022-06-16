import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

export interface EvtAvatarEnterFocusNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  fastFocus: boolean
  useFocusSticky: boolean
  useAutoFocus: boolean
  useGyro: boolean
  canMove: boolean
  showCrossHair: boolean
  focusForward: VectorInterface
  enterNormalFocusShoot: boolean
  enterHoldingFocusShoot: boolean
  disableAnim: boolean
}

class EvtAvatarEnterFocusPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarEnterFocus', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtAvatarEnterFocusNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: EvtAvatarEnterFocusNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAvatarEnterFocusNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAvatarEnterFocusPacket
export default (() => packet = packet || new EvtAvatarEnterFocusPacket())()