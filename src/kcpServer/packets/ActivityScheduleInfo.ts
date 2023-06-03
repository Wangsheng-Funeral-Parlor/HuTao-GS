import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ActivityScheduleInfo } from "@/types/proto"

export interface ActivityScheduleInfoNotify {
  activityScheduleList: ActivityScheduleInfo[]
  remainFlySeaLampNum?: number
}

class ActivityScheduleInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("ActivityScheduleInfo")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const { game } = context

    const notifyData: ActivityScheduleInfoNotify = {
      activityScheduleList: game.activityManager.exportActivityScheduleInfoList(),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: ActivityScheduleInfoPacket
export default (() => (packet = packet || new ActivityScheduleInfoPacket()))()
