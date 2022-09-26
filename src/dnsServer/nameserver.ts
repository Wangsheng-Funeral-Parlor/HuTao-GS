import TLogger from '@/translate/tlogger'
import * as dgram from 'dgram'
import Tcp from 'net'
import DnsServer from '.'
import DnsPacket from './packet'
import { readStream } from './utils'

const logger = new TLogger('QURYNS', 0xfc6114)

export const QUERY_TIMEOUT = 10e3

export interface QueryTask {
  id: number

  msg: Buffer
  sent: number

  resolve: (rsp: Buffer) => void
  reject: () => void
}

export default class NameServer {
  dnsServer: DnsServer

  private udp: dgram.Socket

  private queue: QueryTask[]
  private loop: NodeJS.Timer

  ip: string
  port: number

  constructor(dnsServer: DnsServer, ip: string, port: number = 53) {
    this.dnsServer = dnsServer

    this.ip = ip
    this.port = port

    this.queue = []

    this.udp = dgram.createSocket('udp4')

    this.handleUdpMessage = this.handleUdpMessage.bind(this)

    this.loop = setInterval(this.update.bind(this), 1e3)

    this.udp.on('message', this.handleUdpMessage)
    this.udp.on('error', err => logger.error('message.dnsServer.error.socketError', err))
  }

  destroy() {
    const { udp, loop } = this
    clearInterval(loop)
    udp.close()
  }

  update() {
    const { ip, port, queue, udp } = this
    if (queue.length === 0) return

    const task = queue[0]
    const { msg, sent } = task

    if (sent == null) {
      udp.send(msg, 0, msg.length, port, ip)
      task.sent = Date.now()
      return
    }

    if (Date.now() - sent <= QUERY_TIMEOUT) return

    queue.shift()
    task.resolve(null)

    this.update()
  }

  private handleUdpMessage(msg: Buffer) {
    const { queue } = this
    if (queue.length === 0) return

    const response = DnsPacket.parse(msg)
    const task = queue.find(t => t.id === response.header.id)
    if (!task) return

    queue.splice(queue.indexOf(task), 1)

    if (response.answer.length === 0) {
      task.resolve(null)
      this.update()
      return
    }

    task.resolve(msg)
    this.update()
  }

  async query(id: number, useTcp: boolean, msg: Buffer): Promise<Buffer> {
    const { ip, port } = this

    if (useTcp) {
      const client = new Tcp.Socket()
      client.on('error', err => logger.error('message.dnsServer.error.socketError', err))

      client.connect(port, ip)

      const rsp = await readStream(client)
      const response = DnsPacket.parse(rsp)

      if (response.answer.length === 0) return null

      return rsp
    } else {
      return new Promise<Buffer>((resolve, reject) => {
        this.queue.push({ id, msg, sent: null, resolve, reject })
        this.update()
      })
    }
  }
}