import KcpServer from "../"

import KcpWorkerInterface from "./worker/kcpWorker/kcpWorkerInterface"
import { ConnectionInfo } from "./worker/recvWorker"
import RecvWorkerInterface from "./worker/recvWorker/recvWorkerInterface"
import WorkerInterface from "./worker/workerInterface"

import BaseClass from "#/baseClass"
import { getCmdIdByName, getNameByCmdId, PACKET_HEAD } from "#/cmdIds"
import { PacketContext, verbosePackets } from "#/packet"
import uidPrefix from "#/utils/uidPrefix"
import config from "@/config"
import GlobalState from "@/globalState"
import Logger from "@/logger"
import { cRGB } from "@/tty/utils"
import { PacketHead } from "@/types/kcp"
import { ENetReasonEnum } from "@/types/proto/enum"
import { objToProtobuffer } from "@/utils/proto"

const { kcpPort } = config
const { packetsToDump } = config.game

const logger = new Logger("SOCKET", 0x3449eb)

export default class Socket extends BaseClass {
  server: KcpServer

  workerList: WorkerInterface[]
  workerId: number

  constructor(server: KcpServer) {
    super()

    this.server = server

    this.workerList = []
    this.workerId = 0

    super.initHandlers()
  }

  private async createWorker<T extends WorkerInterface>(
    workerInterface: new (socket: Socket, id: number) => T
  ): Promise<T> {
    const worker = new workerInterface(this, ++this.workerId)

    this.registerHandlers(worker)
    this.workerList.push(worker)

    await worker.start()
    return worker
  }

  private async createKcpWorker(
    recvWorkerId: number,
    iPort: number,
    conv: number,
    connInfo: ConnectionInfo
  ): Promise<KcpWorkerInterface> {
    const worker = await this.createWorker<KcpWorkerInterface>(KcpWorkerInterface)
    if (await worker.init(recvWorkerId, iPort, conv, connInfo)) return worker
    await this.destroyWorker(worker.id)
    return null
  }

  async destroyWorker(id: number) {
    const { workerList } = this
    const worker = workerList.find((w) => w.id === id)
    if (worker == null) return

    await worker.stop()
    this.unregisterHandlers(worker)

    if (workerList.includes(worker)) workerList.splice(workerList.indexOf(worker), 1)
  }

  getWorker<T extends WorkerInterface>(id: number): T {
    return <T>this.workerList.find((worker) => worker.id === id)
  }

  async start() {
    const portList = Array.isArray(kcpPort) ? kcpPort : [kcpPort]
    for (const port of portList) {
      const worker = await this.createWorker<RecvWorkerInterface>(RecvWorkerInterface)
      await worker.init(port)
    }
  }

  async stop() {
    const { workerList } = this
    while (workerList.length > 0) await this.destroyWorker(workerList[workerList.length - 1].id)
  }

  async disconnect(conv: number, enetReason: ENetReasonEnum) {
    const { server } = this
    const client = server.getClient(conv)
    if (!client) return
    const worker = this.getWorker<KcpWorkerInterface>(client.workerId)
    if (!worker) return

    await worker.disconnect(enetReason)
    await this.getWorker<RecvWorkerInterface>(worker.recvWId)?.removeConv(conv)
    await this.destroyWorker(worker.id)
  }

  async sendPacket(conv: number, packetName: string, head: PacketHead, obj: object) {
    try {
      const { server } = this
      const client = server.getClient(conv)
      if (!client) throw new Error("client == null")
      const worker = this.getWorker<KcpWorkerInterface>(client.workerId)
      if (!worker) throw new Error("worker == null")

      const packetID = <number>getCmdIdByName(packetName)
      const packetHead = await objToProtobuffer(head, PACKET_HEAD, true)
      const packetData = await objToProtobuffer(obj, packetID)

      const log = [
        uidPrefix("SEND", client, 0x7000ff),
        GlobalState.get("ShowPacketId") ? packetID : "-",
        cRGB(0x00e5ff, head?.clientSequenceId?.toString()?.slice(-6)?.padStart(6, "0") || "------"),
        packetName,
      ]

      if (verbosePackets.includes(packetName)) logger.verbose(...log)
      else logger.debug(...log)

      await worker.sendPacket(packetID, packetHead, packetData)
    } catch (err) {
      logger.error("Error sending packet:", err)
    }
  }

  /**Events**/

  // Connect
  async handleConnect(recvWorkerId: number, iPort: number, conv: number, connInfo: ConnectionInfo) {
    const { server } = this
    const worker = await this.createKcpWorker(recvWorkerId, iPort, conv, connInfo)
    if (!worker) return
    server.createClient(conv, worker.id)
  }

  // Disconnect
  async handleDisconnect(conv: number, enetReason: ENetReasonEnum) {
    const { server } = this
    await server.disconnect(conv, enetReason)
  }

  // KcpState
  async handleKcpState(conv: number, dl: boolean, rtt: number) {
    const client = this.server.getClient(conv)
    if (!client) return

    client.deadLink = dl
    client.rtt = rtt
  }

  // RecvPacket
  async handleRecvPacket(conv: number, packetID: number, data: Buffer, seqId: number) {
    const { server } = this
    const client = server.getClient(conv)
    if (!client) return

    const packetName: string = getNameByCmdId(packetID).toString()
    const context = new PacketContext(client, seqId)

    const log = [
      uidPrefix("RECV", client, 0x00d5ff),
      GlobalState.get("ShowPacketId") ? packetID : "-",
      cRGB(0xc5ff00, seqId?.toString()?.slice(-6)?.padStart(6, "0") || "------"),
      packetName,
    ]

    if (verbosePackets.includes(packetName)) logger.verbose(...log)
    else logger.debug(...log)

    await server.packetHandler.handle(packetID, packetName, data, context)

    if (packetsToDump.includes(packetName)) await server.dump(`recv-${packetName}-S${seqId || 0}-T${Date.now()}`, data)
  }
}
