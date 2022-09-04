import { LogLevel } from '@/logger'
import parseArgs from '@/utils/parseArgs'
import { appendFileSync } from 'fs'
import { join } from 'path'
import { argv, cwd, exit, stdin } from 'process'
import { formatWithOptions } from 'util'
import ISocket from '../isocket'
import { AcceptTypes, decodeDataList } from './utils/data'

export enum WorkerOpcode {
  // Worker
  WorkerReadyNotify,
  WorkerShutdownNotify,
  LogNotify,

  // KCP worker
  InitKcpReq,
  InitKcpRsp,
  KcpStateNotify,
  ProcessUdpPacketNotify,
  SetKeyReq,
  SetKeyRsp,
  RecvPacketReq,
  RecvPacketRsp,
  SendPacketReq,
  SendPacketRsp,
  DisconnectReq,
  DisconnectRsp,

  // Recv worker
  InitRecvReq,
  InitRecvRsp,
  ConnectReq,
  ConnectRsp,
  SetInternalPortReq,
  SetInternalPortRsp,
  DisconnectNotify,
  RemoveConvReq,
  RemoveConvRsp,
  BlacklistReq,
  BlacklistRsp,
  SendUdpPacketNotify
}

export default class Worker extends ISocket {
  id: number
  iPort: number

  hasError: boolean
  callbackMap: { [opcode: number]: Function[] }

  constructor() {
    super()

    this.id = Number(parseArgs(argv).workerId)
    this.iPort = Number(parseArgs(argv).workerIPort)

    this.hasError = false
    this.callbackMap = {}

    stdin.on('data', data => this.emit('Data', data))
    process.on('uncaughtException', err => this.uncaughtException(err))

    this.log(LogLevel.INFO, 'Worker started.')
    this.sendReady()
  }

  static create(): Worker {
    return new Worker()
  }

  private async sendReady() {
    await this.createISocket()
    await this.sendToInterface(WorkerOpcode.WorkerReadyNotify, this.id, this.getIPort())
    this.log(LogLevel.DEBUG, 'Ready')
  }

  private tryCallback(opcode: WorkerOpcode, args: AcceptTypes[]) {
    const { callbackMap } = this
    const cbList = callbackMap[opcode]
    if (cbList == null) return

    while (cbList.length > 0) {
      try {
        cbList.shift()(args)
      } catch (err) {
        this.log(LogLevel.ERROR, err)
      }
    }
  }

  async sendToInterface(opcode: WorkerOpcode, ...args: AcceptTypes[]) {
    await this.sendToSocket(this.iPort, opcode, ...args)
  }

  waitForMessage(opcode: WorkerOpcode, timeout: number = 15e3): Promise<AcceptTypes[]> {
    return new Promise<AcceptTypes[]>((resolve, reject) => {
      const { callbackMap } = this

      let timedOut = false
      const timer = setTimeout(() => {
        timedOut = true
        reject('Time out')
      }, timeout)

      if (callbackMap[opcode] == null) callbackMap[opcode] = []
      callbackMap[opcode].push((args: AcceptTypes[]) => {
        if (timedOut) return
        clearTimeout(timer)
        resolve(args)
      })
    })
  }

  uncaughtException(err: Error) {
    if (this.hasError) return
    this.hasError = true

    try {
      appendFileSync(join(cwd(), 'data/log/server/workerUncaught.txt'), `${err.stack || err.message}\n`)
    } catch (e) { }
  }

  log(level: LogLevel, ...msg: any[]) {
    this.sendToInterface(WorkerOpcode.LogNotify, level, formatWithOptions({ colors: true }, ...msg))
  }

  async shutdown() {
    await this.emit('Shutdown')
    this.log(LogLevel.DEBUG, 'Shutdown')
    exit()
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer) {
    const { id } = this
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) { // NOSONAR
      case WorkerOpcode.WorkerShutdownNotify: {
        if (args[0] !== id) {
          this.log(LogLevel.ERROR, 'Mismatch id:', args[0])
          break
        }
        await this.shutdown()
        break
      }
      default: {
        if (WorkerOpcode[opcode] == null) return this.log(LogLevel.ERROR, 'Invalid opcode:', opcode)
        this.tryCallback(opcode, args)
      }
    }
  }
}