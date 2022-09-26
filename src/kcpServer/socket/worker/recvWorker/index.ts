import { LogLevel } from '@/logger'
import { cRGB } from '@/tty/utils'
import { waitUntil } from '@/utils/asyncWait'
import * as dgram from 'dgram'
import Worker, { WorkerOpcode } from '../'
import { AcceptTypes, decodeDataList } from '../utils/data'
import handshake from '../utils/handshake'

export interface ConnectionInfo {
  token: number
  address: string
  port: number
  connected?: boolean
  iPort?: number
}

export default class RecvWorker extends Worker {
  socket: dgram.Socket

  connInfoMap: { [conv: number]: ConnectionInfo }
  blockedAddressList: string[]

  constructor() {
    super()

    this.socket = dgram.createSocket('udp4')
    this.socket.on('message', (msg, rinfo) => this.emit('UDPMessage', msg, rinfo))

    this.connInfoMap = {}
    this.blockedAddressList = []

    super.initHandlers(this)
  }

  static create(): RecvWorker {
    return new RecvWorker()
  }

  async sendToKcpWorker(conv: number, opcode: WorkerOpcode, ...args: AcceptTypes[]) {
    await this.sendToSocket(this.connInfoMap[conv]?.iPort, opcode, ...args)
  }

  init(port: number) {
    if (isNaN(port)) {
      this.log(LogLevel.ERROR, 'message.worker.error.invalidPort', port)
      this.sendToInterface(WorkerOpcode.InitRecvRsp, false)
      return
    }

    const { socket } = this
    socket.bind(port, () => {
      this.log(LogLevel.INFO, 'message.worker.info.listen', cRGB(0xffffff, socket.address().port.toString()))
      this.sendToInterface(WorkerOpcode.InitRecvRsp, true)
    })
  }

  setInternalPort(conv: number, port: number) {
    const { connInfoMap } = this
    const connInfo = connInfoMap[conv]
    if (!connInfo) return this.sendToInterface(WorkerOpcode.SetInternalPortRsp, false)
    connInfo.iPort = port
    this.log(LogLevel.DEBUG, 'message.worker.debug.setISocketPort', conv.toString(16).padStart(8, '0').toUpperCase(), port)
    this.sendToInterface(WorkerOpcode.SetInternalPortRsp, true)
  }

  removeConv(conv: number) {
    const { connInfoMap } = this
    if (connInfoMap[conv] == null) return this.sendToInterface(WorkerOpcode.RemoveConvRsp, false)
    delete connInfoMap[conv]
    this.log(LogLevel.DEBUG, 'message.worker.debug.removeConv', conv.toString(16).padStart(8, '0').toUpperCase())
    this.sendToInterface(WorkerOpcode.RemoveConvRsp, true)
  }

  blacklist(conv: number) {
    const { connInfoMap, blockedAddressList } = this
    const connInfo = connInfoMap[conv]
    if (connInfo == null) return this.sendToInterface(WorkerOpcode.BlacklistRsp, false)

    if (!blockedAddressList.includes(connInfo.address)) {
      blockedAddressList.push(connInfo.address)
      this.log(LogLevel.INFO, 'message.worker.info.blockAddr', connInfo.address)
    }

    this.sendToInterface(WorkerOpcode.BlacklistRsp, true)
  }

  sendUdpPacket(conv: number, data: Buffer) {
    const { socket, connInfoMap } = this
    const connInfo = connInfoMap[conv]
    if (!connInfo) return

    socket.send(data, 0, data.length, connInfo.port, connInfo.address)
  }

  processUdpPacket(conv: number, data: Buffer) {
    this.sendToKcpWorker(conv, WorkerOpcode.ProcessUdpPacketNotify, data)
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer): Promise<void> {
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) {
      case WorkerOpcode.InitRecvReq:
        this.init(<number>args[0])
        break
      case WorkerOpcode.SetInternalPortReq:
        this.setInternalPort(<number>args[0], <number>args[1])
        break
      case WorkerOpcode.RemoveConvReq:
        this.removeConv(<number>args[0])
        break
      case WorkerOpcode.BlacklistReq:
        this.blacklist(<number>args[0])
        break
      case WorkerOpcode.SendUdpPacketNotify:
        this.sendUdpPacket(<number>args[0], <Buffer>args[1])
        break
      default:
        await super.handleMessage(msg)
    }
  }

  // UDPHandshake
  async handleUDPHandshake(data: Buffer, rinfo: dgram.RemoteInfo) {
    const { socket, connInfoMap, blockedAddressList } = this
    const { address, port } = rinfo
    const { Magic1, Conv, Token, Data, buffer } = handshake(data)

    switch (Magic1) {
      case 325: // 0x145 MAGIC_SEND_BACK_CONV
        if (connInfoMap[Conv]) break
        connInfoMap[Conv] = {
          token: Token,
          address,
          port
        }

        socket.send(buffer, 0, buffer.length, port, address)
        this.sendToInterface(WorkerOpcode.ConnectReq, Conv, JSON.stringify(connInfoMap[Conv]))

        while ((await this.waitForMessage(WorkerOpcode.ConnectRsp))[0] !== Conv);
        if (connInfoMap[Conv] == null) break

        connInfoMap[Conv].connected = true
        break
      case 404: // 0x194 MAGIC_DISCONNECT
        this.sendToInterface(WorkerOpcode.DisconnectNotify, Conv, Data)
        break
      default:
        blockedAddressList.push(address)
    }
  }

  // UDPMessage
  async handleUDPMessage(data: Buffer, rinfo: dgram.RemoteInfo) {
    const { connInfoMap, blockedAddressList } = this
    const { address } = rinfo

    if (blockedAddressList.includes(address)) return
    if (data.length < 20) return blockedAddressList.push(address)

    // Handshake
    if (data.length === 20) return this.emit('UDPHandshake', data, rinfo)

    const conv: number = data.readUInt32LE()
    const token: number = data.readUInt32LE(4)
    const connInfo = connInfoMap[conv]

    if (connInfo?.token !== token) return
    if (!connInfo.connected) await waitUntil(() => connInfo.connected)

    this.processUdpPacket(conv, data)
  }
}