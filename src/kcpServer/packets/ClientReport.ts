import Packet, { PacketContext, PacketInterface } from "#/packet"
import uidPrefix from "#/utils/uidPrefix"
import Logger from "@/logger"
import { ClientStateEnum } from "@/types/enum"
import { stringXorDecode } from "@/utils/xor"

const logger = new Logger("REPORT", 0xfff838)

export interface ClientReportNotify {
  reportType: string
  reportValue: string
}

class ClientReportPacket extends Packet implements PacketInterface {
  constructor() {
    super("ClientReport", {
      notifyState: ClientStateEnum.LOGIN,
      notifyStatePass: true,
    })
  }

  async recvNotify(context: PacketContext, data: ClientReportNotify): Promise<void> {
    const { player } = context
    const { reportType, reportValue } = data

    logger.debug(
      uidPrefix(reportType.slice(0, 4).padEnd(4, " "), player),
      <string>stringXorDecode(Buffer.from(reportValue, "hex"), 0x7d)
    )
  }
}

let packet: ClientReportPacket
export default (() => (packet = packet || new ClientReportPacket()))()
