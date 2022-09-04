import Socket from '#/socket'
import { ENetReasonEnum } from '@/types/proto/enum'
import { WorkerOpcode } from '../'
import { ConnectionInfo } from '../recvWorker'
import RecvWorkerInterface from '../recvWorker/recvWorkerInterface'
import { decodeDataList } from '../utils/data'
import WorkerInterface from '../workerInterface'

export default class KcpWorkerInterface extends WorkerInterface {
  recvWId: number
  recvWIPort: number
  conv: number
  connInfo: ConnectionInfo

  constructor(socket: Socket, id: number) {
    super(socket, id, 'kcp')

    this.conv = null

    super.initHandlers(this)
  }

  async init(recvWorkerId: number, iPort: number, conv: number, connInfo: ConnectionInfo): Promise<boolean> {
    this.sendToWorker(WorkerOpcode.InitKcpReq, iPort, conv, JSON.stringify(connInfo))
    const [success] = <[boolean, number]>await this.waitForMessage(WorkerOpcode.InitKcpRsp)
    if (success) {
      this.recvWId = recvWorkerId
      this.recvWIPort = iPort
      this.conv = conv
      this.connInfo = connInfo

      await this.socket.getWorker<RecvWorkerInterface>(recvWorkerId)?.setInternalPort(conv, this.iPort)
    }
    return success
  }

  async setKey(key: Buffer) {
    this.sendToWorker(WorkerOpcode.SetKeyReq, key)
    return this.waitForMessage(WorkerOpcode.SetKeyRsp)
  }

  async sendPacket(packetID: number, packetHead: Buffer, packetData: Buffer) {
    this.sendToWorker(WorkerOpcode.SendPacketReq, packetID, packetHead, packetData)
    return this.waitForMessage(WorkerOpcode.SendPacketRsp)
  }

  async disconnect(enetReason: ENetReasonEnum) {
    this.sendToWorker(WorkerOpcode.DisconnectReq, enetReason)
    return this.waitForMessage(WorkerOpcode.DisconnectRsp)
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer): Promise<void> {
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) {
      case WorkerOpcode.KcpStateNotify:
        await this.emit('KcpState', this.conv, <boolean>args[0], <number>args[1])
        break
      case WorkerOpcode.RecvPacketReq:
        await this.emit('RecvPacket', this.conv, <number>args[0], <Buffer>args[1], <number>args[2])
        this.sendToWorker(WorkerOpcode.RecvPacketRsp, args[2])
        break
      default:
        await super.handleMessage(msg)
    }
  }

  // Restart
  async handleRestart() {
    const { recvWId, recvWIPort: port, conv, connInfo } = this
    if (recvWId == null || port == null || conv == null || connInfo == null) return this.stop()
    await this.init(recvWId, port, conv, connInfo)
  }
}