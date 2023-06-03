import { join } from "path"
import { cwd } from "process"

import Worker, { WorkerOpcode } from "../"
import { ConnectionInfo } from "../recvWorker"
import { AcceptTypes, decodeDataList } from "../utils/data"
import { Handshake } from "../utils/handshake"
import { Kcp } from "../utils/kcp"

import { getNameByCmdId, PACKET_HEAD } from "#/cmdIds"
import Packet from "#/packet"
import config from "@/config"
import { LogLevel } from "@/logger"
import { PacketHead } from "@/types/kcp"
import { QueryCurrRegionHttpRsp } from "@/types/proto"
import { ENetReasonEnum } from "@/types/proto/enum"
import { waitMs } from "@/utils/asyncWait"
import DispatchKey from "@/utils/dispatchKey"
import { fileExists, readFile } from "@/utils/fileSystem"
import { getEc2bKey } from "@/utils/mhyCrypto/ec2b"
import { dataToProtobuffer } from "@/utils/proto"
import { xor } from "@/utils/xor"

const { version } = config.game
const { autoPatch } = config.dispatch

const skipWaitPackets = ["AbilityInvocationsNotify", "CombatInvocationsNotify", "UnionCmdNotify"]

export default class KcpWorker extends Worker {
  recvWIPort: number | null

  conv: number | null

  kcp: Kcp | null
  timer: NodeJS.Timer | null
  connInfo: ConnectionInfo | null

  seqId: number
  key: Buffer | null

  receiving: boolean

  constructor() {
    super()

    this.recvWIPort = null

    this.conv = null

    this.kcp = null
    this.timer = null
    this.connInfo = null

    this.seqId = 0
    this.key = null

    this.receiving = false

    super.initHandlers(this)
  }

  static create(): KcpWorker {
    return new KcpWorker()
  }

  private async getDispatchKey(): Promise<Buffer> {
    let key = Buffer.alloc(4096)

    if (autoPatch) {
      const binPath = join(cwd(), `data/bin/${version}/QueryCurrRegionHttpRsp.bin`)
      if (await fileExists(binPath)) {
        const curRegionRsp: QueryCurrRegionHttpRsp = await dataToProtobuffer(
          await readFile(binPath),
          "QueryCurrRegionHttpRsp",
          true
        )
        key = getEc2bKey(Buffer.from(curRegionRsp.clientSecretKey))
      }
    } else {
      key = await DispatchKey.getXorKey()
    }

    return key
  }

  private inputKcp(buf: Buffer) {
    this.kcp.input(buf)
    this.updateKcp()
  }

  private recvKcp() {
    const { kcp } = this
    const size = kcp.peekSize()
    if (size <= 0) return null

    const buf = Buffer.alloc(size)
    if (kcp.recv(buf) <= 0) return null

    return buf
  }

  private updateKcp() {
    const { kcp } = this
    kcp.update(Date.now())
    this.sendToInterface(WorkerOpcode.KcpStateNotify, kcp.isDeadLink())
  }

  private async waitPacketRsp(seqId: number) {
    try {
      while (true) {
        const [rspSeqId] = <[number]>await this.waitForMessage(WorkerOpcode.RecvPacketRsp, 2e3)
        if (rspSeqId === seqId) break
      }
    } catch (err) {}
  }

  async sendToRecvWorker(opcode: WorkerOpcode, ...args: AcceptTypes[]) {
    await this.sendToSocket(this.recvWIPort, opcode, ...args)
  }

  /**
   * Initialize kcp worker
   * @param iPort Recv worker iPort
   * @param conv Connection id
   * @param info Connection info
   */
  async init(iPort: number, conv: number, info: ConnectionInfo) {
    try {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      this.recvWIPort = iPort

      const { token } = info
      const kcp = new Kcp(conv, token, this.sendUdpPacket.bind(this))

      kcp.setNodelay(true, 8, false)
      kcp.setInterval(0)
      kcp.setMaxResend(1024)

      this.conv = conv
      this.kcp = kcp
      this.connInfo = info
      this.key = await this.getDispatchKey()
      this.timer = setInterval(this.updateKcp.bind(this), 1e3 / 30)

      this.sendToInterface(WorkerOpcode.InitKcpRsp, true)
      this.log(LogLevel.DEBUG, "message.worker.debug.initKcpSuccess", conv.toString(16).padStart(8, "0").toUpperCase())
    } catch (err) {
      this.log(LogLevel.ERROR, "message.worker.error.initKcpFail", err)
      this.sendToInterface(WorkerOpcode.InitKcpRsp, false)
    }
  }

  /**
   * Handle udp packet
   * @param data Packet data
   */
  async processUdpPacket(data: Buffer) {
    this.inputKcp(data)

    if (this.receiving) return
    this.receiving = true

    try {
      while (true) {
        const packet = this.recvKcp()
        if (!packet) break

        xor(packet, this.key)

        if (!Packet.isPacket(packet)) {
          this.log(LogLevel.WARN, "message.worker.warn.invalidPacket")
          continue
        }

        const packetID: number = packet.readUInt16BE(2)
        const { head, data } = Packet.decode(packet)

        const packetHead = await dataToProtobuffer<PacketHead>(head, PACKET_HEAD, true)
        const seqId = packetHead?.clientSequenceId || this.seqId
        this.seqId = seqId

        this.sendToInterface(WorkerOpcode.RecvPacketReq, packetID, data, seqId)
        if (!skipWaitPackets.includes(<string>getNameByCmdId(packetID))) await this.waitPacketRsp(seqId)
      }
    } catch (err) {
      this.log(LogLevel.ERROR, "message.worker.error.UDPError", err)
    } finally {
      this.receiving = false
    }
  }

  /**
   * Set XOR key
   * @param key XOR key buffer
   */
  setKey(key: Buffer) {
    this.key = key
    this.sendToInterface(WorkerOpcode.SetKeyRsp)
  }

  /**
   * Send kcp packet
   * @param packetID Packet id
   * @param packetHead Packet head buffer
   * @param packetData Packet data buffer
   */
  sendPacket(packetID: number, packetHead: Buffer, packetData: Buffer) {
    try {
      const { kcp, key } = this
      kcp.send(Packet.encode(packetHead, packetData, packetID, key))
      this.sendToInterface(WorkerOpcode.SendPacketRsp, true)
    } catch (err) {
      this.log(LogLevel.ERROR, "message.worker.error.sendPacketError", err)
      this.sendToInterface(WorkerOpcode.SendPacketRsp, false)
    }
  }

  /**
   * Send udp packet
   * @param data Udp packet data
   */
  sendUdpPacket(data: Buffer) {
    this.sendToRecvWorker(WorkerOpcode.SendUdpPacketNotify, this.conv, data)
  }

  /**
   * Send disconnect handshake
   * @param enetReason Disconnect reason
   */
  disconnect(enetReason: ENetReasonEnum) {
    const { conv, connInfo } = this
    if (!connInfo) return

    const { token } = connInfo
    const handshake = new Handshake(Handshake.MAGIC_DISCONNECT, conv, token, enetReason)
    handshake.encode()

    this.sendUdpPacket(handshake.buffer)
    this.sendToInterface(WorkerOpcode.DisconnectRsp)
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer): Promise<void> {
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) {
      case WorkerOpcode.InitKcpReq:
        await this.init(<number>args[0], <number>args[1], JSON.parse(<string>args[2]))
        break
      case WorkerOpcode.ProcessUdpPacketNotify:
        await this.processUdpPacket(<Buffer>args[0])
        break
      case WorkerOpcode.SetKeyReq:
        this.setKey(<Buffer>args[0])
        break
      case WorkerOpcode.SendPacketReq:
        this.sendPacket(<number>args[0], <Buffer>args[1], <Buffer>args[2])
        break
      case WorkerOpcode.DisconnectReq:
        this.disconnect(<number>args[0])
        break
      default:
        await super.handleMessage(msg)
    }
  }

  // Shutdown
  async handleShutdown() {
    this.disconnect(ENetReasonEnum.ENET_SERVER_SHUTDOWN)
    await waitMs(500)
  }
}
