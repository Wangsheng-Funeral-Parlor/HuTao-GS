import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface SetPlayerSignatureReq {
  signature: string
}

export interface SetPlayerSignatureRsp {
  retcode: RetcodeEnum
  signature: string
}

class SetPlayerSignaturePacket extends Packet implements PacketInterface {
  constructor() {
    super('SetPlayerSignature', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetPlayerSignatureReq): Promise<void> {
    const { profile } = context.player
    const { signature } = data

    profile.signature = signature

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      signature: profile.signature
    })
  }

  async response(context: PacketContext, data: SetPlayerSignatureRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerSignaturePacket
export default (() => packet = packet || new SetPlayerSignaturePacket())()