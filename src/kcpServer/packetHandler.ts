import ProtoMatch from '#/protomatch'
import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'
import dataUtil from '@/utils/proto'
import KcpServer from '.'
import { PacketContext, PacketInterface } from './packet'

const logger = new Logger('PACKET', 0x8810cd)

export default class PacketHandler {
  private server: KcpServer
  private ptm: ProtoMatch

  private instances: { [name: string]: PacketInterface }

  constructor(server: KcpServer) {
    this.server = server
    this.ptm = new ProtoMatch()

    this.instances = {}
  }

  private async getPacket(name: string): Promise<PacketInterface> {
    const { instances } = this

    if (!instances[name]) {
      instances[name] = (await import(`./packets/${name}`)).default as PacketInterface
    }

    return instances[name]
  }

  private parsePacketName(packetName: string): { name: string, type: string } {
    const [name, type] = packetName.match(/(^.*)([A-Z].*$)/).slice(1)
    return { name, type }
  }

  private unknownPacket(packetData: Buffer, packetID: number): void {
    const { server, ptm } = this

    logger.warn('Unknown packet:', packetID)
    if (!server.getGState('UseProtoMatch')) return

    logger.debug('ProtoMatch:', packetID, JSON.stringify(ptm.parseBuffer(packetData), null, 2), JSON.stringify(ptm.findProto(packetData), null, 2))
  }

  async handle(packetID: number, packetName: string, packetData: Buffer, context: PacketContext, ...any: any[]): Promise<void> {
    // Unknown packet
    if (packetID === parseInt(packetName)) return this.unknownPacket(packetData, packetID)

    try {
      const { name, type } = this.parsePacketName(packetName)
      const packet = await this.getPacket(name)
      const {
        reqState, reqStatePass, reqStateMask,
        notifyState, notifyStatePass, notifyStateMask,
        reqWaitState, reqWaitStatePass, reqWaitStateMask,
        notifyWaitState, notifyWaitStatePass, notifyWaitStateMask
      } = packet

      const state = {
        'Req': [
          reqState, reqStatePass, reqStateMask,
          reqWaitState, reqWaitStatePass, reqWaitStateMask
        ],
        'Notify': [
          notifyState, notifyStatePass, notifyStateMask,
          notifyWaitState, notifyWaitStatePass, notifyWaitStateMask
        ]
      }[type] as [ClientStateEnum, boolean, number, ClientStateEnum, boolean, number]

      const data = await dataUtil.dataToProtobuffer(packetData, packetID)

      if (state == null || !packet.checkState(context, state[0], state[1], state[2])) return
      await packet.waitState(context, state[3], state[4], state[5])

      switch (type) {
        case 'Req':
          await packet.request(context, data, ...any)
          break
        case 'Notify':
          await packet.recvNotify(context, data, ...any)
          break
      }
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') logger.verbose('No handler for packet:', this.server.getGState('ShowPacketId') ? packetID : '-', packetName)
      else logger.error('Error handling packet:', err)
    }
  }
}