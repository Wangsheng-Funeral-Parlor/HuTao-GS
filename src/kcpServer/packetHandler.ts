import ProtoMatch from '#/protomatch'
import GlobalState from '@/globalState'
import TLogger from '@/translate/tlogger'
import { ClientStateEnum } from '@/types/enum'
import { protobufDecode } from '@/utils/proto'
import { PacketContext, PacketInterface } from './packet'

const logger = new TLogger('PACKET', 0x8810cd)

export default class PacketHandler {
  private ptm: ProtoMatch

  private instances: { [name: string]: PacketInterface }

  public constructor() {
    this.ptm = new ProtoMatch()

    this.instances = {}
  }

  public async handle(cmdId: number, cmdName: string, body: Buffer, context: PacketContext, ...any: any[]): Promise<void> {
    // Dump unknown packet
    if (cmdId === parseInt(cmdName)) return this.decodeError(cmdId, body)

    try {
      const { name, type } = this.parsePacketName(cmdName)
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

      const data = await protobufDecode(cmdId, body)

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
      if (err.code === 'MODULE_NOT_FOUND') logger.verbose('message.packet.debug.noHandler', GlobalState.get('ShowPacketId') ? cmdId : '-', cmdName)
      else logger.error('message.packet.error.handler', err)
    }
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

  private decodeError(cmdId: number, body: Buffer): void {
    const { ptm } = this

    logger.warn('message.packet.warn.decodeError', cmdId)

    if (!GlobalState.get('UseProtoMatch')) return

    let decodedBody = body.length === 0 ? '<empty>' : JSON.stringify(ptm.parseBuffer(body), null, 2)
    let similarProto = body.length === 0 ? '<empty>' : JSON.stringify(ptm.findProto(body), null, 2)

    if (decodedBody.split('\n').length > 20) decodedBody = JSON.stringify(JSON.parse(decodedBody))
    if (similarProto.split('\n').length > 20) similarProto = JSON.stringify(JSON.parse(similarProto))

    logger.debug('generic.param4', 'ProtoMatch:', cmdId, decodedBody, similarProto)
  }
}