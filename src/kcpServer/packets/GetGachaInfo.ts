import Packet, { PacketInterface, PacketContext } from '#/packet'
import { GachaInfo } from '@/types/enum/gacha'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface GetGachaInfoReq { }

export interface GetGachaInfoRsp {
  retcode: RetcodeEnum
  gachaInfoList?: GachaInfo[]
  gachaRandom?: number
}

class GetGachaInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetGachaInfo', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: GetGachaInfoReq): Promise<void> {
    await this.response(context, { retcode: RetcodeEnum.RET_GACHA_INAVAILABLE })
  }

  async response(context: PacketContext, data: GetGachaInfoRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetGachaInfoPacket
export default (() => packet = packet || new GetGachaInfoPacket())()