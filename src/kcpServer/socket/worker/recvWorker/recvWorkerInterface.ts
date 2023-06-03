import { WorkerOpcode } from "../"
import { decodeDataList } from "../utils/data"
import WorkerInterface from "../workerInterface"

import { ConnectionInfo } from "./"

import Socket from "#/socket"
import { ENetReasonEnum } from "@/types/proto/enum"

export default class RecvWorkerInterface extends WorkerInterface {
  port: number

  constructor(socket: Socket, id: number) {
    super(socket, id, "recv")

    super.initHandlers(this)
  }

  async init(port: number): Promise<boolean> {
    if (!this.running) return false
    this.sendToWorker(WorkerOpcode.InitRecvReq, port)
    const [success] = <[boolean]>await this.waitForMessage(WorkerOpcode.InitRecvRsp)
    if (success) this.port = port
    return success
  }

  async setInternalPort(conv: number, port: number) {
    if (!this.running) return false
    this.sendToWorker(WorkerOpcode.SetInternalPortReq, conv, port)
    const [success] = <[boolean]>await this.waitForMessage(WorkerOpcode.SetInternalPortRsp)
    return success
  }

  async removeConv(conv: number): Promise<boolean> {
    if (!this.running) return false
    this.sendToWorker(WorkerOpcode.RemoveConvReq, conv)
    const [success] = <[boolean]>await this.waitForMessage(WorkerOpcode.RemoveConvRsp)
    return success
  }

  async blacklist(conv: number): Promise<boolean> {
    if (!this.running) return false
    this.sendToWorker(WorkerOpcode.BlacklistReq, conv)
    const [success] = <[boolean]>await this.waitForMessage(WorkerOpcode.BlacklistRsp)
    return success
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer): Promise<void> {
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) {
      case WorkerOpcode.ConnectReq:
        await this.emit("Connect", this.id, this.iPort, <number>args[0], <ConnectionInfo>JSON.parse(<string>args[1]))
        this.sendToWorker(WorkerOpcode.ConnectRsp, args[0])
        break
      case WorkerOpcode.DisconnectNotify:
        await this.emit("Disconnect", <number>args[0], <ENetReasonEnum>args[1])
        break
      default:
        await super.handleMessage(msg)
    }
  }

  // Restart
  async handleRestart() {
    const { port } = this
    if (port == null) return this.stop()
    await this.init(port)
  }
}
