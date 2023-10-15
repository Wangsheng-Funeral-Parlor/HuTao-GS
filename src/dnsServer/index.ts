import config from '@/config'
import Server from '@/server'
import TLogger from '@/translate/tlogger'
import { cRGB } from '@/tty/utils'
import { waitUntil } from '@/utils/asyncWait'
import { writeFile } from '@/utils/fileSystem'
import * as dgram from 'dgram'
import Tcp, { AddressInfo } from 'net'
import { join } from 'path'
import { cwd } from 'process'
import EventEmitter from 'promise-events'
import NameServer from './nameserver'
import DnsPacket, { PacketHeader, PacketQuestion, PacketResource, ResA, ResCNAME, ResHTTPS } from './packet'
import { NAME_TO_QTYPE, QTYPE_TO_NAME } from './packet/consts'
import { listAnswer, readStream } from './utils'

const logger = new TLogger('DNSSRV', 0xfc9c14)

class QueryCache {
  private header: PacketHeader
  private answer: PacketResource[]
  private authority: PacketResource[]
  private additional: PacketResource[]
  private expire: number

  public constructor(packet: DnsPacket) {
    const { header, answer, authority, additional } = packet

    this.header = header
    this.answer = answer
    this.authority = authority
    this.additional = additional
    this.expire = Date.now() + ((Math.min(...answer.map(ans => ans.ttl)) ?? 15) * 1e3)
  }

  public getHeader(id: number): PacketHeader {
    return new PacketHeader({ ...this.header, id })
  }

  public getAnswer(): PacketResource[] {
    return this.answer
  }

  public getAuthority(): PacketResource[] {
    return this.authority
  }

  public getAdditional(): PacketResource[] {
    return this.additional
  }

  public isExpired(): boolean {
    return this.expire <= Date.now()
  }
}

class QueryLock {
  private nextIdx: number
  private currIdx: number

  public constructor() {
    this.nextIdx = 0
    this.currIdx = 0
  }

  public async acquire(): Promise<void> {
    const idx = this.nextIdx++

    await waitUntil(() => this.currIdx === idx)

    const { nextIdx, currIdx } = this

    if (currIdx !== 0 && currIdx === nextIdx) {
      this.nextIdx = 0
      this.currIdx = 0
    }
  }

  public release(): void {
    this.currIdx++
  }
}

export default class DnsServer extends EventEmitter {
  public server: Server

  private tcp: Tcp.Server
  private udp: dgram.Socket

  private nsMap: { [address: string]: NameServer }
  private cacheMap: { [key: string]: QueryCache }
  private lockMap: { [key: string]: QueryLock }

  public constructor(server: Server) {
    super()

    this.server = server

    this.tcp = new Tcp.Server()
    this.udp = dgram.createSocket('udp4')

    this.nsMap = {}
    this.cacheMap = {}
    this.lockMap = {}

    this.handleTcpConnection = this.handleTcpConnection.bind(this)
    this.handleUdpMessage = this.handleUdpMessage.bind(this)

    this.tcp.on('connection', this.handleTcpConnection)
    this.tcp.on('error', err => logger.error('message.dnsServer.error.TCPError', err))

    this.udp.on('message', this.handleUdpMessage)
    this.udp.on('error', err => logger.error('message.dnsServer.error.UDPError', err))
  }

  public start(): void {
    let listening = 0

    this.tcp.listen(config.dnsPort, () => {
      logger.info('message.dnsServer.info.TCPListen', cRGB(0xffffff, this.getTcpAddress().port.toString()))
      if (++listening >= 2) this.emit('listening')
    })

    this.udp.bind(config.dnsPort, () => {
      logger.info('message.dnsServer.info.UDPListen', cRGB(0xffffff, this.getUdpAddress().port.toString()))
      if (++listening >= 2) this.emit('listening')
    })
  }

  public stop(): void {
    const { nsMap, tcp, udp } = this

    for (const addr in nsMap) {
      nsMap[addr].destroy()
      delete nsMap[addr]
    }

    tcp.close()
    udp.close()
  }

  public getTcpAddress(): AddressInfo {
    return this.tcp.address() as AddressInfo
  }

  public getUdpAddress(): AddressInfo {
    return this.udp.address()
  }

  private handleTcpConnection(client: Tcp.Socket): void {
    readStream(client)
      .then(msg => this.processQuery(msg))
      .then(rsp => {
        if (rsp == null) {
          client.end()
          return
        }

        const len = Buffer.alloc(2)
        len.writeUInt16BE(rsp.length)

        client.end(Buffer.concat([len, rsp]))
      }).catch(err => {
        logger.error('message.dnsServer.error.TCPError', err)
      })
  }

  private handleUdpMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
    const { udp } = this
    const { address, port } = rinfo

    this.processQuery(msg).then(rsp => {
      if (rsp == null) return

      udp.send(rsp, 0, rsp.length, port, address)
    })
  }

  private isRedirect(query: string, domain: string): boolean {
    const index = query.indexOf(domain)

    return index >= 0 && index === (query.length - domain.length) && !query.startsWith('autopatch')
  }

  private async processQuery(msg: Buffer): Promise<Buffer> {
    const { domains, nameservers } = config

    try {
      if (msg.length === 0) return null

      const query = DnsPacket.parse(msg)
      if (query.question.length === 0) return null

      const { name, type } = query.question[0]
      const typeName = QTYPE_TO_NAME[type] || type

      await this.acquireLock(query)

      logger.verbose('generic.param1', `Qry: ${name} (${typeName})`)

      if (this.readCache(query)) {
        this.releaseLock(query)

        const rsp = DnsPacket.write(query, 1024)

        logger.verbose('generic.param1', `CaRsp: [QRY]:${name} [ANS]:${listAnswer(rsp)}`)

        return rsp
      }

      for (const domain in domains) {
        if (!this.isRedirect(name, domain)) continue

        this.createRedirectResponse(query, query.question[0], domain)

        this.writeCache(query)
        this.releaseLock(query)

        const rsp = DnsPacket.write(query, 1024)

        logger.verbose('generic.param1', `RdRsp: [DM]:${name} [ANS]:${listAnswer(rsp)}`)

        return rsp
      }

      for (const ns of nameservers) {
        const rsp = await this.queryNS(ns, query.header.id, false, msg)

        if (rsp == null) continue

        this.writeCache(DnsPacket.parse(rsp))
        this.releaseLock(query)

        logger.verbose('generic.param1', `NsRsp: [NS]:${ns} [QRY]:${name} [TYP]:${typeName} [ANS]:${listAnswer(rsp)}`)

        return rsp
      }

      query.header.qr = 1
      query.header.rd = 1
      query.header.ra = 1

      this.writeCache(query)
      this.releaseLock(query)

      logger.verbose('generic.param1', `NoRsp: [QRY]:${name} [TYP]:${typeName}`)

      return DnsPacket.write(query, 1024)
    } catch (err) {
      if ((<Error>err).name === 'RangeError') return null

      logger.error('generic.param1', err)
      try { await writeFile(join(cwd(), 'data/log/dump', `dns-${Date.now()}.bin`), msg) } catch (_err) { }
    }

    return null
  }

  private queryNS(nsAddress: string, id: number, useTcp: boolean, msg: Buffer): Promise<Buffer> {
    const { nsMap } = this

    const address = nsAddress.split(':')
    const ip = address[0]
    const port = parseInt(address[1]) || 53

    const ns = nsMap[nsAddress] || new NameServer(this, ip, port)
    if (nsMap[nsAddress] == null) nsMap[nsAddress] = ns

    return ns.query(id, useTcp, msg)
  }

  private createRedirectResponse(packet: DnsPacket, question: PacketQuestion, domain: string): void {
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

  private async acquireLock(packet: DnsPacket): Promise<void> {
    const { lockMap } = this
    const { question } = packet

    for (const q of question) {
      const { name, type } = q
      const key = `${type}:${name}`

      // Create lock instance
      if (lockMap[key] == null) lockMap[key] = new QueryLock()

      // Acquire lock
      await lockMap[key].acquire()
    }
  }

  private releaseLock(packet: DnsPacket): void {
    const { lockMap } = this
    const { question } = packet

    for (const q of question) {
      const { name, type } = q

      // Release lock
      lockMap[`${type}:${name}`]?.release()
    }
  }

  private readCache(packet: DnsPacket): boolean {
    const { cacheMap } = this
    const { header, question, answer, authority, additional } = packet

    for (const q of question) {
      const { name, type } = q

      const key = `${type}:${name}`
      const cache = cacheMap[key]

      // Check if cache miss
      if (cache == null) return false

      // Check if cache expired
      if (cache.isExpired()) {
        cacheMap[key] = null
        return false
      }

      const cacheAnswer = cache.getAnswer()
      const cacheAuthority = cache.getAuthority()
      const cacheAdditional = cache.getAdditional()

      packet.header = cache.getHeader(header.id)
      answer.push(...cacheAnswer.filter(ans => !answer.includes(ans)))
      authority.push(...cacheAuthority.filter(aut => !authority.includes(aut)))
      additional.push(...cacheAdditional.filter(add => !additional.includes(add)))
    }

    return true
  }

  private writeCache(packet: DnsPacket): void {
    const { cacheMap } = this
    const { question } = packet

    for (const q of question) {
      const { name, type } = q

      // Write answer to cache
      cacheMap[`${type}:${name}`] = new QueryCache(packet)
    }
  }
}