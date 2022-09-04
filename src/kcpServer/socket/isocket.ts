import BaseClass from '#/baseClass'
import { waitUntil } from '@/utils/asyncWait'
import * as dgram from 'dgram'
import { AcceptTypes, encodeData, sizeOf } from './worker/utils/data'

export default class ISocket extends BaseClass {
  iSocket: dgram.Socket
  creatingSocket: boolean
  msgBuf: Buffer

  constructor() {
    super()

    this.iSocket = null
    this.creatingSocket = false
    this.msgBuf = Buffer.alloc(0)
  }

  createISocket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.iSocket != null) return resolve()

      const socket = dgram.createSocket('udp4')
      socket.on('message', data => this.emit('ISocketMessage', data))
      socket.on('error', reject)
      socket.bind(() => {
        this.iSocket = socket
        socket.off('error', reject)
        resolve()
      })
    })
  }

  getIPort(): number {
    return this.iSocket?.address()?.port
  }

  async sendToSocket(port: number, opcode: number, ...args: AcceptTypes[]): Promise<void> {
    try {
      if (port == null) return

      if (this.creatingSocket) await waitUntil(() => !this.creatingSocket)
      if (this.iSocket == null) {
        this.creatingSocket = true
        await this.createISocket()
        this.creatingSocket = false
      }

      this.iSocket.send(
        Buffer.concat([
          Buffer.from([0xCD, 0xEF]),
          encodeData(Buffer.concat([
            Buffer.from([opcode]),
            ...args.map(arg => encodeData(arg))]
          ))
        ]),
        port
      )
    } catch (err) {
      this.creatingSocket = false
    }
  }

  /**Events**/

  // ISocketMessage
  async handleISocketMessage(data: Buffer) {
    if (data.length < 2 || data.readUInt16BE() !== 0xCDEF) return

    let buf = Buffer.concat([this.msgBuf, data.subarray(2)])
    while (true) {
      const size = sizeOf(buf)
      if (size <= 0) break
      await this.emit('Message', buf.subarray(5, size))
      buf = buf.subarray(size)
    }

    this.msgBuf = buf
  }
}