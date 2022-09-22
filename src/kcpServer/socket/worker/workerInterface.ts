import Logger, { LogLevel } from '@/logger'
import { attachedSpawn } from '@/utils/childProcess'
import { ChildProcess } from 'child_process'
import Socket from '../'
import ISocket from '../isocket'
import { WorkerOpcode } from './'
import { AcceptTypes, decodeDataList } from './utils/data'

const logger = new Logger('WORKER', 0x7a34eb)

export default class WorkerInterface extends ISocket {
  socket: Socket

  id: number
  type: string

  workerProcess: ChildProcess | null
  iPort: number | null

  active: boolean
  running: boolean
  callbackMap: { [opcode: number]: Function[] }

  exitCount: number
  lastExit: number

  constructor(socket: Socket, id: number, type: string = '') {
    super()

    this.socket = socket

    this.id = id
    this.type = type

    this.workerProcess = null
    this.iPort = null

    this.active = false
    this.running = false
    this.callbackMap = {}

    this.exitCount = 0
    this.lastExit = 0
  }

  private tryCallback(opcode: WorkerOpcode, args: AcceptTypes[]) {
    const { callbackMap } = this
    const cbList = callbackMap[opcode]
    if (cbList == null) return

    while (cbList.length > 0) {
      try {
        cbList.shift()(args)
      } catch (err) {
        logger.error(err)
      }
    }
  }

  async sendToWorker(opcode: WorkerOpcode, ...args: AcceptTypes[]): Promise<void> {
    if (!this.running) return
    await this.sendToSocket(this.iPort, opcode, ...args)
  }

  waitForMessage(opcode: WorkerOpcode): Promise<AcceptTypes[]> {
    return new Promise<AcceptTypes[]>(resolve => {
      const { callbackMap } = this
      if (callbackMap[opcode] == null) callbackMap[opcode] = []
      callbackMap[opcode].push(resolve)
    })
  }

  async start(): Promise<void> {
    if (this.running) return

    const { id, type } = this

    logger.debug('Starting:', id)
    this.active = true

    await this.createISocket()

    const workerProcess = await attachedSpawn(process.execPath, [
      process.argv[1].replace('mainEntry', 'workerEntry'),
      '--stack_trace_limit=200',
      `-lm=${type}`,
      `-workerId=${id}`,
      `-workerIPort=${this.getIPort()}`
    ])
    this.workerProcess = workerProcess
    this.running = true

    logger.debug('Worker spawn:', id, 'ISocket port:', this.getIPort())

    workerProcess.stderr.setEncoding('utf8')
    workerProcess.stdout.setEncoding('utf8')
    workerProcess.stdout.on('data', data => logger.debug('stdout:', id, data.trim()))
    workerProcess.stderr.on('data', data => logger.debug('stderr:', id, data.trim()))

    workerProcess.on('exit', (code, signal) => this.emit('Exit', code, signal))
    workerProcess.on('error', err => this.emit('Error', err))

    const [wid, wport] = <[number, number]>await this.waitForMessage(WorkerOpcode.WorkerReadyNotify)
    if (wid !== id) throw new Error('Mismatch worker id')

    this.iPort = wport
  }

  async stop(): Promise<void> {
    if (!this.running) return

    const { id, workerProcess } = this
    logger.debug('Stopping:', id)
    this.active = false

    return new Promise<void>(resolve => {
      workerProcess?.once('exit', () => {
        this.workerProcess = null
        this.iPort = null
        resolve()
      })
      this.sendToWorker(WorkerOpcode.WorkerShutdownNotify, id)
    })
  }

  /**Events**/

  // Message
  async handleMessage(msg: Buffer) {
    const { id } = this
    const opcode = msg.readUInt8()
    const args = decodeDataList(msg, 1)

    switch (opcode) { // NOSONAR
      case WorkerOpcode.LogNotify: {
        logger.log(<LogLevel>args[0], `[Worker:${id}]`, args[1])
        break
      }
      default: {
        if (WorkerOpcode[opcode] == null) return logger.error('Invalid opcode:', opcode)
        this.tryCallback(opcode, args)
      }
    }
  }

  // Error
  async handleError(err: Error) {
    logger.error(err)
  }

  // Exit
  async handleExit(code: number, signal: NodeJS.Signals) {
    if (Date.now() - this.lastExit > 60e3) this.exitCount = 0
    this.lastExit = Date.now()
    this.exitCount++

    const { id, active, exitCount } = this

    this.running = false

    logger.info('Worker exit:', id, 'Code:', code, 'Signal:', signal)
    if (!active || exitCount >= 3) return

    try {
      logger.info('Restarting worker:', id)

      await this.stop()
      await this.start()
      this.emit('Restart')
    } catch (err) {
      logger.error('Worker failed to restart:', err)
    }
  }
}