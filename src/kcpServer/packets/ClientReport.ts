import Packet, { PacketInterface, PacketContext } from '#/packet'
import uidPrefix from '#/utils/uidPrefix'
import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'

const logger = new Logger('REPORT', 0xfff838)

function reportXor(hex: string): string {
  const input = Buffer.from(hex, 'hex')
  const output = Buffer.alloc(input.length)

  let char = input[input.length - 1] ^ 0x7D
  for (let i = input.length - 1; i >= 0; i--) {
    char = input[i] ^ char
    output[i] = char
  }

  return output.toString()
}

export interface ClientReportNotify {
  reportType: string
  reportValue: string
}

class ClientReportPacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientReport', {
      notifyState: ClientStateEnum.LOGIN,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: ClientReportNotify): Promise<void> {
    const { player } = context
    const { reportType, reportValue } = data

    logger.debug(uidPrefix(reportType.slice(0, 4).padEnd(4, ' '), player), reportXor(reportValue))
  }
}

let packet: ClientReportPacket
export default (() => packet = packet || new ClientReportPacket())()