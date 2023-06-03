import Packet, { PacketInterface, PacketContext } from "#/packet"
import { RetcodeEnum } from "@/types/proto/enum"

export interface MusicGameSettleReq {
  musicBasicId?: number
  score: number
  combo: number
  correctHit: number
  guid?: number
  //KJNDJLBOJLM: boolean
  //FBELCAFFGIJ: number
  //OOFMAKIDFOL: number
  //HJPDEIMECHB: number
  //MNCMGANHCFI: number[]
  maxCombo: number
  //JJADNMELLAH: number
  //EIAGEEFABPO: number[]
  //CPIFLFBHNJP: number
  //DJCKOHKLIOB: boolean
  //GGHBOMGJGFP: number
  //PFHCIHKCJFJ: boolean
  speed: number
}

export interface MusicGameSettleRsp {
  retcode: RetcodeEnum
  musicBasicId?: number
  isUnlockNextLevel?: boolean
  isNewRecord?: boolean
  guid?: number
}

class MusicGameSettlePacket extends Packet implements PacketInterface {
  constructor() {
    super("MusicGameSettle")
  }

  async request(context: PacketContext, data: MusicGameSettleReq): Promise<void> {
    const { player } = context
    const { musicBasicId, guid, maxCombo, combo, correctHit, score, speed } = data

    console.log(
      `[MG] UID: ${player.uid} MaxCombo: ${maxCombo} Combo: ${combo} CHit: ${correctHit} Score: ${score} Speed: ${speed}`
    )

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      musicBasicId,
      guid,
    })
  }

  async response(context: PacketContext, data: MusicGameSettleRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: MusicGameSettlePacket
export default (() => (packet = packet || new MusicGameSettlePacket()))()
