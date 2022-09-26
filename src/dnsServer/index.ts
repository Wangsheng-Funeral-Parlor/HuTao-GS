import config from '@/config'
import Server from '@/server'
import TLogger from '@/translate/tlogger'
import { cRGB } from '@/tty/utils'
import { writeFile } from '@/utils/fileSystem'
import * as dgram from 'dgram'
import Tcp, { AddressInfo } from 'net'
import { join } from 'path'
import { cwd } from 'process'
import EventEmitter from 'promise-events'
import NameServer from './nameserver'
import DnsPacket, { PacketQuestion, ResA, ResCNAME, ResHTTPS } from './packet'
import { NAME_TO_QTYPE, QTYPE_TO_NAME } from './packet/consts'
import { listAnswer, readStream } from './utils'

const logger = new TLogger('DNSSRV', 0xfc9c14)

export default class DnsServer extends EventEmitter {
  server: Server

  private tcp: Tcp.Server
  private udp: dgram.Socket

  private nsMap: { [address: string]: NameServer }

  constructor(server: Server) {
    super()

    this.server = server

    this.tcp = new Tcp.Server()
    this.udp = dgram.createSocket('udp4')

    this.nsMap = {}

    this.handleTcpConnection = this.handleTcpConnection.bind(this)
    this.handleUdpMessage = this.handleUdpMessage.bind(this)

    this.tcp.on('connection', this.handleTcpConnection)
    this.tcp.on('error', err => logger.error('message.dnsServer.error.TCPError', err))

    this.udp.on('message', this.handleUdpMessage)
    this.udp.on('error', err => logger.error('message.dnsServer.error.UDPError', err))
  }

  start(): void {
    let listening = 0

    this.tcp.listen(config.dnsPort, () => {
      logger.info('message.dnsServer.info.TCPListen', cRGB(0xffffff, this.tcpAddress().port.toString()))
      if (++listening >= 2) this.emit('listening')
    })

    this.udp.bind(config.dnsPort, () => {
      logger.info('message.dnsServer.info.UDPListen', cRGB(0xffffff, this.udpAddress().port.toString()))
      if (++listening >= 2) this.emit('listening')
    })
  }

  stop(): void {
    const { nsMap, tcp, udp } = this

    for (const addr in nsMap) {
      nsMap[addr].destroy()
      delete nsMap[addr]
    }

    tcp.close()
    udp.close()
  }

  tcpAddress(): AddressInfo {
    return this.tcp.address() as AddressInfo
  }

  udpAddress(): AddressInfo {
    return this.udp.address()
  }

  private async handleTcpConnection(client: Tcp.Socket) {
    try {
      const msg = await readStream(client)
      const rsp = await this.processQuery(msg)

      if (rsp == null) {
        client.end()
        return
      }

      const len = Buffer.alloc(2)
      len.writeUInt16BE(rsp.length)

      client.end(Buffer.concat([len, rsp]))
    } catch (err) {
      logger.error('message.dnsServer.error.TCPError', err)
    }
  }

  private async handleUdpMessage(msg: Buffer, rinfo: dgram.RemoteInfo) {
    const { udp } = this
    const { address, port } = rinfo

    const rsp = await this.processQuery(msg)
    if (rsp == null) return

    udp.send(rsp, 0, rsp.length, port, address)
  }

  async processQuery(msg: Buffer): Promise<Buffer> {
    const { domains, nameservers } = config

    try {
      if (msg.length === 0) return null

      const query = DnsPacket.parse(msg)
      if (query.question.length === 0) return null

      const { name, type } = query.question[0]
      const typeName = QTYPE_TO_NAME[type] || type

      logger.verbose('generic.param1', `Qry: ${name} (${typeName})`)

      for (const domain in domains) {
        const index = name.indexOf(domain)
        if (index === -1 || index !== (name.length - domain.length) || name.indexOf('autopatch') === 0) continue

        this.createResponse(query, query.question[0], domain)

        const rsp = DnsPacket.write(query, 1024)
        logger.verbose('generic.param1', `RdRsp: [DM]:${name} [ANS]:${listAnswer(rsp)}`)
        return rsp
      }

      for (const ns of nameservers) {
        const rsp = await this.queryNS(ns, query.header.id, false, msg)
        if (rsp == null) continue

        logger.verbose('generic.param1', `NsRsp: [NS]:${ns} [QRY]:${name} [TYP]:${typeName} [ANS]:${listAnswer(rsp)}`)
        return rsp
      }

      logger.verbose('generic.param1', `NoRsp: [QRY]:${name} [TYP]:${typeName}`)

      query.header.qr = 1
      query.header.rd = 1
      query.header.ra = 1

      return DnsPacket.write(query, 1024)
    } catch (err) {
      if ((<Error>err).name === 'RangeError') return null

      logger.error('generic.param1', err)
      try { await writeFile(join(cwd(), 'data/log/dump', `dns-${Date.now()}.bin`), msg) } catch (_err) { }
    }

    return null
  }

  queryNS(nsAddress: string, id: number, useTcp: boolean, msg: Buffer): Promise<Buffer> {
    const { nsMap } = this

    const address = nsAddress.split(':')
    const ip = address[0]
    const port = parseInt(address[1]) || 53

    const ns = nsMap[nsAddress] || new NameServer(this, ip, port)
    if (nsMap[nsAddress] == null) nsMap[nsAddress] = ns

    return ns.query(id, useTcp, msg)
  }

  createResponse(packet: DnsPacket, question: PacketQuestion, domain: string) {
    const { domains } = config
    const { header, answer } = packet
    const { name, type } = question

    header.qr = 1
    header.rd = 1
    header.ra = 1

    const resCNAME = new ResCNAME(name)
    resCNAME.name = name
    resCNAME.ttl = 30
    answer.push(resCNAME)

    switch (type) {
      case NAME_TO_QTYPE.A: {
        const resA = new ResA(domains[domain] || config.hostIp)
        resA.name = name
        resA.ttl = 30
        answer.push(resA)
        break
      }
      case NAME_TO_QTYPE.HTTPS: {
        const resHTTPS = new ResHTTPS(1, name)
        resHTTPS.name = name
        resHTTPS.ttl = 30
        answer.push(resHTTPS)
        break
      }
    }
  }
}