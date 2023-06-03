import * as dgram from "dgram"

import { AcceptTypes, encodeData } from "./worker/utils/data"

import BaseClass from "#/baseClass"
import { waitUntil } from "@/utils/asyncWait"

const ISocketBufferTTL = 10e3 // 10 seconds
const ISocketMessageChunkSize = 8192
const ISocketMaxNum = 0x10000

const ISocketPacketMagic1 = 0x89ab
const ISocketPacketMagic2 = 0xcdef
enum ISocketPacketOpcode {
  Message = 0,
  Resend = 1,
}

class ISocketChannel {
  is: ISocket
  port: number

  sendBuf: { buf: Buffer; ts: number }[]
  recvBuf: { [idx: number]: Buffer }
  msgBuf: Buffer

  private sendIdx: number
  private recvIdx: number | null

  constructor(is: ISocket, port: number) {
    this.is = is
    this.port = port

    this.sendBuf = []
    this.recvBuf = {}
    this.msgBuf = Buffer.alloc(0)

    this.sendIdx = 0
    this.recvIdx = null
  }

  private calcDiff(current: number, target: number): number {
    return [target - current, target - (current + ISocketMaxNum), target - (current - ISocketMaxNum)]
      .map((v) => [v, Math.abs(v)])
      .sort((a, b) => a[1] - b[1])[0][0]
  }

  private incIdx(): number {
    this.sendIdx++
    this.sendIdx %= ISocketMaxNum
    return this.sendIdx
  }

  private getMessage(idx: number, ts: number): Buffer | null {
    const { sendIdx, sendBuf } = this

    const diff = this.calcDiff(sendIdx, idx)
    const index = sendBuf.length - 1 + diff

    const msg = sendBuf[index]
    if (msg == null || this.calcDiff(ts, msg.ts) < 0) return null

    sendBuf.splice(0, index + 1)
    return msg.buf
  }

  private async send(opcode: ISocketPacketOpcode, sndIdx: number, data: Buffer = Buffer.alloc(0)) {
    const { is, port } = this
    if (!(await is.createISocket())) return

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

    const packet = Buffer.concat([magic1, opc, idx, size, data, magic2])

    is.iSocket.send(packet, port)
  }

  private async requestResend(idx: number) {
    const ts = Buffer.alloc(2)
    ts.writeUInt16LE(Date.now() % ISocketMaxNum)
    await this.send(ISocketPacketOpcode.Resend, idx, ts)
  }

  private async resendMessage(idx: number, ts: number) {
    const msg = this.getMessage(idx, ts)
    if (msg == null) return

    await this.send(ISocketPacketOpcode.Message, idx, msg)
  }

  async sendMessage(msg: Buffer) {
    const { sendBuf } = this

    const now = Date.now()
    const len = Buffer.alloc(4)
    len.writeUInt32LE(msg.length)
    msg = Buffer.concat([len, msg])

    while (msg.length > 0) {
      const end = Math.min(ISocketMessageChunkSize, msg.length)
      const chunk = msg.subarray(0, end)
      msg = msg.subarray(end)

      sendBuf.push({ buf: chunk, ts: now % ISocketMaxNum })
      await this.send(ISocketPacketOpcode.Message, this.incIdx(), chunk)
    }

    sendBuf.push(...sendBuf.splice(0).filter((b) => now - b.ts <= ISocketBufferTTL))
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
        await this.resendMessage(sndIdx, packet.readUInt16LE(10))
        break
      default:
        console.log("Invalid opcode:", opcode)
    }
  }

  async handleMessage(sndIdx: number, msg: Buffer) {
    if (this.recvIdx == null) this.recvIdx = sndIdx
    if (this.calcDiff(this.recvIdx, sndIdx) < 0) return

    this.recvBuf[sndIdx] = msg
    await this.flushRecvBuf()
  }

  async flushRecvBuf() {
    const { recvBuf } = this

    while (true) {
      const recv = recvBuf[this.recvIdx]
      if (recv == null) return this.requestResend(this.recvIdx)

      delete recvBuf[this.recvIdx]

      this.recvIdx++
      this.recvIdx %= ISocketMaxNum

      this.msgBuf = Buffer.concat([this.msgBuf, recv])
      await this.flushMsgBuf()
    }
  }

  async flushMsgBuf() {
    const { is, msgBuf } = this
    if (msgBuf.length < 4) return

    const len = msgBuf.readUInt32LE()
    if (msgBuf.length < 4 + len) return

    const msg = msgBuf.subarray(4, 4 + len)
    this.msgBuf = msgBuf.subarray(4 + len)

    await is.emit("Message", msg)
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
        const socket = dgram.createSocket("udp4")
        socket.on("message", (data, rinfo) => this.emit("ISocketMessage", data, rinfo))
        socket.on("error", reject)
        socket.bind(() => {
          this.iSocket = socket
          socket.off("error", reject)
          resolve()
        })
      })
    } catch (err) {
    } finally {
      this.creatingSocket = false
    }

    return this.iSocket != null
  }

  getIPort(): number {
    return this.iSocket?.address()?.port
  }

  async sendToSocket(port: number, opcode: number, ...args: AcceptTypes[]): Promise<void> {
    if (port == null) return

    this.getChannel(port).sendMessage(Buffer.concat([Buffer.from([opcode]), ...args.map((arg) => encodeData(arg))]))
  }

  /**Events**/

  // ISocketMessage
  async handleISocketMessage(data: Buffer, rinfo: dgram.RemoteInfo) {
    await this.getChannel(rinfo.port).recv(data)
  }
}
