import BaseClass from '#/baseClass'
import { waitUntil } from '@/utils/asyncWait'
import * as dgram from 'dgram'
import { AcceptTypes, encodeData } from './worker/utils/data'

const ISocketBufferSize = 24
const ISocketMaxIdx = 0x10000

const ISocketPacketMagic1 = 0x89AB
const ISocketPacketMagic2 = 0xCDEF
enum ISocketPacketOpcode {
  Message = 0,
  Resend = 1
}

class ISocketChannel {
  is: ISocket
  port: number

  sendBuf: Buffer[]
  recvBuf: { [idx: number]: Buffer }

  private sendIdx: number
  private recvIdx: number | null

  constructor(is: ISocket, port: number) {
    this.is = is
    this.port = port

    this.sendBuf = []
    this.recvBuf = {}

    this.sendIdx = 0
    this.recvIdx = null
  }

  private calcDiff(current: number, target: number): number {
    return [
      (target - current),
      (target - (current + ISocketMaxIdx)),
      (target - (current - ISocketMaxIdx))
    ].map(v => [v, Math.abs(v)]).sort((a, b) => a[1] - b[1])[0][0]
  }

  private incIdx(): number {
    this.sendIdx++
    this.sendIdx %= ISocketMaxIdx
    return this.sendIdx
  }

  private getMessage(idx: number): Buffer | null {
    const { sendIdx, sendBuf } = this
    const diff = this.calcDiff(sendIdx, idx)
    return sendBuf[(sendBuf.length - 1) + diff] || null
  }

  private async send(opcode: ISocketPacketOpcode, sndIdx: number, data: Buffer = Buffer.alloc(0)) {
    const { is, port } = this
    if (!await is.createISocket()) return

    const magic1 = Buffer.alloc(2)
    magic1.writeUInt16LE(ISocketPacketMagic1)
    const opc = Buffer.alloc(2)
    opc.writeUInt16LE(opcode)
    const idx = Buffer.alloc(2)
    idx.writeUInt16LE(sndIdx)
    const size = Buffer.alloc(4)
    size.writeUInt32LE(data.length)
    const magic2 = Buffer.alloc(2)
    magic2.writeUInt16LE(ISocketPacketMagic2)

    const packet = Buffer.concat([
      magic1,
      opc,
      idx,
      size,
      data,
      magic2
    ])

    is.iSocket.send(packet, port)
  }

  private async requestResend(idx: number) {
    await this.send(ISocketPacketOpcode.Resend, idx)
  }

  private async resendMessage(idx: number) {
    const msg = this.getMessage(idx)
    if (msg == null) return

    await this.send(ISocketPacketOpcode.Message, idx, msg)
  }

  async sendMessage(msg: Buffer) {
    const { sendBuf } = this

    sendBuf.push(msg)
    while (sendBuf.length > ISocketBufferSize) sendBuf.shift()

    await this.send(ISocketPacketOpcode.Message, this.incIdx(), msg)
  }

  async recv(packet: Buffer) {
    const packetSize = packet.length
    if (packetSize < 12) return

    const magic1 = packet.readUInt16LE()
    const opcode = packet.readUInt16LE(2)
    const sndIdx = packet.readUInt16LE(4)
    const dtSize = packet.readUInt32LE(6)
    const magic2 = packet.readUInt16LE(packetSize - 2)

    if (packetSize < 12 + dtSize || magic1 !== ISocketPacketMagic1 || magic2 !== ISocketPacketMagic2) return

    switch (opcode) {
      case ISocketPacketOpcode.Message:
        await this.handleMessage(sndIdx, packet.subarray(10, 10 + dtSize))
        break
      case ISocketPacketOpcode.Resend:
        await this.resendMessage(sndIdx)
        break
      default:
        console.log('Invalid opcode:', opcode)
    }
  }

  async handleMessage(sndIdx: number, msg: Buffer) {
    if (this.recvIdx == null) this.recvIdx = sndIdx
    if (this.calcDiff(this.recvIdx, sndIdx) < 0) return

    this.recvBuf[sndIdx] = msg
    await this.flushRecvBuf()
  }

  async flushRecvBuf() {
    const { is, recvBuf } = this

    while (true) {
      const msg = recvBuf[this.recvIdx]
      if (msg == null) return this.requestResend(this.recvIdx)

      delete recvBuf[this.recvIdx]

      this.recvIdx++
      this.recvIdx %= ISocketMaxIdx

      await is.emit('Message', msg)
    }
  }
}

export default class ISocket extends BaseClass {
  iSocket: dgram.Socket

  creatingSocket: boolean
  channels: { [port: number]: ISocketChannel }

  constructor() {
    super()

    this.iSocket = null

    this.creatingSocket = false
    this.channels = {}
  }

  private getChannel(port: number) {
    const { channels } = this

    let channel: ISocketChannel = channels[port]
    if (channel == null) {
      channel = new ISocketChannel(this, port)
      channels[port] = channel
    }

    return channel
  }

  async createISocket(): Promise<boolean> {
    try {
      if (this.creatingSocket) await waitUntil(() => !this.creatingSocket)
      if (this.iSocket != null) return true

      this.creatingSocket = true

      await new Promise<void>((resolve, reject) => {
        const socket = dgram.createSocket('udp4')
        socket.on('message', (data, rinfo) => this.emit('ISocketMessage', data, rinfo))
        socket.on('error', reject)
        socket.bind(() => {
          this.iSocket = socket
          socket.off('error', reject)
          resolve()
        })
      })
    } catch (err) { } finally {
      this.creatingSocket = false
    }

    return this.iSocket != null
  }

  getIPort(): number {
    return this.iSocket?.address()?.port
  }

  async sendToSocket(port: number, opcode: number, ...args: AcceptTypes[]): Promise<void> {
    if (port == null) return

    this.getChannel(port).sendMessage(
      Buffer.concat([
        Buffer.from([opcode]),
        ...args.map(arg => encodeData(arg))]
      )
    )
  }

  /**Events**/

  // ISocketMessage
  async handleISocketMessage(data: Buffer, rinfo: dgram.RemoteInfo) {
    await this.getChannel(rinfo.port).recv(data)
  }
}