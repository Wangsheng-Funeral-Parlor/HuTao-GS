import Packet, { PacketContext, PacketInterface } from '#/packet'
import { CoopChapter } from '@/types/proto'

export interface CoopDataNotify {
  chapterList: CoopChapter[]
  isHaveProgress?: boolean
  curCoopPoint?: number
  viewedChapterList: number[]
}

class CoopDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('CoopData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: CoopDataNotify = {
      chapterList: [],
      viewedChapterList: []
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: CoopDataPacket
export default (() => packet = packet || new CoopDataPacket())()