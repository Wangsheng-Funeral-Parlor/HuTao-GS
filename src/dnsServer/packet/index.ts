import BufferCursor from './buffercursor'
import { EDNS_TO_NAME, NAME_TO_EDNS, NAME_TO_QCLASS, NAME_TO_QTYPE, QTYPE_TO_NAME } from './consts'

export interface LableIndex { [str: string]: number }
export type ResData = string | Buffer | (string | Buffer)[]

export class EDNSData {
  ednsCode: number

  constructor(ednsCode: number = 0xFF) {
    this.ednsCode = ednsCode
  }

  // dummy
  static decode(_buf: BufferCursor, _len: number): EDNSData { return }
  encode(_buf?: BufferCursor, _index?: LableIndex): BufferCursor { return }
}

export class OptECS extends EDNSData {
  family: number
  sourcePrefixLength: number
  scopePrefixLength: number
  ip: string

  constructor(family: number = 0, sourcePrefixLength: number = 0, scopePrefixLength: number = 0, ip: string = '') {
    super(NAME_TO_EDNS.ECS)

    this.family = family
    this.sourcePrefixLength = sourcePrefixLength
    this.scopePrefixLength = scopePrefixLength
    this.ip = ip
  }

  static decode(buf: BufferCursor, len: number): OptECS {
    const family = buf.readUInt16BE()
    const sourcePrefixLength = buf.readUInt8()
    const scopePrefixLength = buf.readUInt8()
    let ip = ''

    if (family === 1) {
      const ipv4Octets: number[] = []
      for (let i = 4; i < len; i++) ipv4Octets.push(buf.readUInt8())
      while (ipv4Octets.length < 4) ipv4Octets.push(0)
      ip = ipv4Octets.join('.')
    } else {
      buf.seek(buf.tell() + (len - 4))
    }

    return new OptECS(family, sourcePrefixLength, scopePrefixLength, ip)
  }

  encode(buf?: BufferCursor): BufferCursor {
    const { family, sourcePrefixLength, scopePrefixLength, ip } = this

    buf.writeUInt16BE(family)
    buf.writeUInt8(sourcePrefixLength)
    buf.writeUInt8(scopePrefixLength)

    const splitIp = ip.split('.').map(s => parseInt(s))
    for (let i = 0; i < 4; i++) buf.writeUInt8(splitIp[i])

    return buf
  }
}

export class PacketHeader {
  id: number
  qr: number
  opcode: number
  aa: number
  tc: number
  rd: number
  ra: number
  z: number
  rcode: number
  qdcount: number
  ancount: number
  nscount: number
  arcount: number

  constructor(header?: { [k: number]: number }) {
    this.id = 0
    this.qr = 0
    this.opcode = 0
    this.aa = 0
    this.tc = 0
    this.rd = 0
    this.ra = 0
    this.z = 0
    this.rcode = 0
    this.qdcount = 0
    this.ancount = 0
    this.nscount = 0
    this.arcount = 0

    for (const k in header) {
      if (this[k] != null) this[k] = header[k]
    }
  }

  static parse(buf: BufferCursor | Buffer): PacketHeader {
    const header = new PacketHeader()
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    header.id = buf.readUInt16BE()

    const val = buf.readUInt16BE()
    header.qr = (val & 0x8000) >> 15
    header.opcode = (val & 0x7800) >> 11
    header.aa = (val & 0x400) >> 10
    header.tc = (val & 0x200) >> 9
    header.rd = (val & 0x100) >> 8
    header.ra = (val & 0x80) >> 7
    header.z = (val & 0x70) >> 4
    header.rcode = (val & 0xF)
    header.qdcount = buf.readUInt16BE()
    header.ancount = buf.readUInt16BE()
    header.nscount = buf.readUInt16BE()
    header.arcount = buf.readUInt16BE()

    return header
  }

  toBuffer(buf: BufferCursor | Buffer): BufferCursor {
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    buf.writeUInt16BE(this.id & 0xFFFF)

    let val = 0
    val += (this.qr << 15) & 0x8000
    val += (this.opcode << 11) & 0x7800
    val += (this.aa << 10) & 0x400
    val += (this.tc << 9) & 0x200
    val += (this.rd << 8) & 0x100
    val += (this.ra << 7) & 0x80
    val += (this.z << 4) & 0x70
    val += this.rcode & 0xF

    buf.writeUInt16BE(val & 0xFFFF)
    buf.writeUInt16BE(this.qdcount & 0xFFFF)
    buf.writeUInt16BE(this.ancount & 0xFFFF)
    buf.writeUInt16BE(this.nscount & 0xFFFF)
    buf.writeUInt16BE(this.arcount & 0xFFFF)

    return buf
  }
}

export class PacketQuestion {
  name: string
  type: number
  class: number

  constructor(name?: string, type: number = NAME_TO_QTYPE.ANY, cls: number = NAME_TO_QCLASS.ANY) {
    this.name = name
    this.type = type
    this.class = cls
  }

  static parse(buf: BufferCursor | Buffer): PacketQuestion {
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    return new PacketQuestion(
      nameUnpack(buf),
      buf.readUInt16BE(),
      buf.readUInt16BE()
    )
  }

  toBuffer(buf: BufferCursor | Buffer, index?: LableIndex): BufferCursor {
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    namePack(this.name, buf, index)
    buf.writeUInt16BE(this.type)
    buf.writeUInt16BE(this.class)

    return buf
  }
}

export class PacketResource {
  static encoders: { [name: string]: typeof PacketResource }

  name: string
  ttl: number
  type: number
  class: number
  data?: ResData

  constructor(...args: any[])
  constructor(name: string = '', type: number = NAME_TO_QTYPE.ANY, cls: number = NAME_TO_QCLASS.ANY, ttl = 300) {
    this.name = name
    this.type = type
    this.class = cls
    this.ttl = ttl
  }

  static parse(buf: BufferCursor | Buffer): PacketResource {
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    let res: PacketResource

    const name = nameUnpack(buf)
    const type = buf.readUInt16BE()
    const cls = buf.readUInt16BE()
    const ttl = buf.readUInt32BE()

    const { encoders } = PacketResource
    const encoderName = `Res${QTYPE_TO_NAME[type]}`
    const len = buf.readUInt16BE()

    if (encoderName in encoders) {
      res = encoders[encoderName].decode(buf, len)

      res.name = name
      res.type = type
      res.class = cls
      res.ttl = ttl
    } else {
      res = new PacketResource(name, type, cls, ttl)

      const arr = []
      for (let i = 0; i < len; i++) arr.push(buf.readUInt8())
      res.data = Buffer.from(arr)
    }

    return res
  }

  toBuffer(buf?: BufferCursor | Buffer, index?: LableIndex): BufferCursor {
    buf = buf || Buffer.alloc(0)
    if (buf instanceof Buffer) buf = new BufferCursor(buf)

    namePack(this.name, buf, index)
    buf.writeUInt16BE(this.type)
    buf.writeUInt16BE(this.class)
    buf.writeUInt32BE(this.ttl)

    if (this.constructor === PacketResource) {
      buf.writeUInt16BE(this.data.length)
      buf.copy(<Buffer>this.data)
    } else {
      this.encode(buf, index)
    }

    return buf
  }

  // dummy
  static decode(_buf: BufferCursor, _len: number): PacketResource { return }
  encode(_buf: BufferCursor, _index?: LableIndex): BufferCursor { return }
}

export class ResA extends PacketResource {
  address: string

  constructor(address: string = '') {
    super('', NAME_TO_QTYPE.A, NAME_TO_QCLASS.IN)
    this.address = address
  }

  static decode(buf: BufferCursor, len: number): ResA {
    const parts = []
    for (let i = 0; i < len; i++) parts.push(buf.readUInt8())
    return new ResA(parts.join('.'))
  }

  encode(buf: BufferCursor): BufferCursor {
    const parts = this.address.split('.')
    buf.writeUInt16BE(parts.length)
    for (const part of parts) buf.writeUInt8(parseInt(part))
    return buf
  }
}

export class ResMX extends PacketResource {
  exchange: string
  priority: number

  constructor(exchange: string = '', priority: number = 0) {
    super('', NAME_TO_QTYPE.MX, NAME_TO_QCLASS.IN)

    this.exchange = exchange
    this.priority = priority
  }

  static decode(buf: BufferCursor): ResMX {
    const priority = buf.readUInt16BE()
    const exchange = nameUnpack(buf)
    return new ResMX(exchange, priority)
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { exchange, priority } = this
    buf.writeUInt16BE(namePack(exchange, null, index, true).length + 2)
    buf.writeUInt16BE(priority)
    namePack(exchange, buf, index)
    return buf
  }
}

export class ResAAAA extends PacketResource {
  address: string

  constructor(address: string = '') {
    super('', NAME_TO_QTYPE.AAAA, NAME_TO_QCLASS.IN)
    this.address = address
  }

  static decode(buf: BufferCursor, len: number): ResAAAA {
    const parts = []
    for (let i = 0; i < len; i += 2) parts.push(buf.readUInt16BE())
    return new ResAAAA(parts.map(p => p > 0 ? p.toString(16) : '').join(':'))
  }

  encode(buf: BufferCursor): BufferCursor {
    const parts = this.address.split(':')
    buf.writeUInt16BE(parts.length * 2)
    for (const part of parts) buf.writeUInt16BE(parseInt(part, 16))
    return buf
  }
}

export class ResNS extends PacketResource {
  ns: string

  constructor(ns: string = '') {
    super('', NAME_TO_QTYPE.NS, NAME_TO_QCLASS.IN)
    this.ns = ns
  }

  static decode(buf: BufferCursor): ResNS {
    return new ResNS(nameUnpack(buf))
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { ns } = this
    buf.writeUInt16BE(namePack(ns, null, index, true).length)
    namePack(ns, buf, index)
    return buf
  }
}

export class ResCNAME extends PacketResource {
  domain: string

  constructor(domain: string = '') {
    super('', NAME_TO_QTYPE.CNAME, NAME_TO_QCLASS.IN)
    this.domain = domain
  }

  static decode(buf: BufferCursor): ResCNAME {
    return new ResCNAME(nameUnpack(buf))
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { domain } = this
    buf.writeUInt16BE(namePack(domain, null, index, true).length)
    namePack(domain, buf, index)
    return buf
  }
}

export class ResPTR extends ResCNAME {
  constructor(domain: string = '') {
    super(domain)
    this.type = NAME_TO_QTYPE.PTR
  }

  static decode(buf: BufferCursor): ResPTR {
    return new ResPTR(nameUnpack(buf))
  }
}

export class ResTXT extends PacketResource {
  constructor(data: ResData) {
    super('', NAME_TO_QTYPE.TXT, NAME_TO_QCLASS.IN)
    this.data = data
  }

  static decode(buf: BufferCursor, len: number): ResTXT {
    const chunks = []

    let i = 0
    while (i < len) {
      const chkLen = buf.readUInt8()
      chunks.push(buf.toString('utf8', chkLen))
      i += chkLen + 1
    }

    return new ResTXT(chunks)
  }

  encode(buf: BufferCursor): BufferCursor {
    const { data } = this

    const characterStrings = Array.isArray(data) ? data : [data]
    const characterStringBuffers = <Buffer[]>characterStrings.map(cs => {
      if (Buffer.isBuffer(cs)) return cs
      if (typeof cs === 'string') return Buffer.from(cs, 'utf8')
      return false
    }).filter(cs => cs)

    const len = characterStringBuffers.reduce((sum, csBuf) => sum + csBuf.length, 0)

    buf.writeUInt16BE(len + characterStringBuffers.length)

    for (const csBuf of characterStringBuffers) {
      buf.writeUInt8(csBuf.length)
      buf.copy(csBuf, 0)
    }

    return buf
  }
}

export class ResSPF extends ResTXT {
  constructor(data: ResData) {
    super(data)
    this.type = NAME_TO_QTYPE.SPF
  }

  static decode(buf: BufferCursor, len: number): ResSPF {
    return new ResSPF(ResTXT.decode(buf, len).data)
  }
}

export class ResSOA extends PacketResource {
  primary: string
  admin: string
  serial: number
  refresh: number
  retry: number
  expiration: number
  minimum: number

  constructor(
    primary: string = '',
    admin: string = '',
    serial: number = 0,
    refresh: number = 0,
    retry: number = 0,
    expiration: number = 0,
    minimum: number = 0
  ) {
    super('', NAME_TO_QTYPE.SOA, NAME_TO_QCLASS.IN)

    this.primary = primary
    this.admin = admin
    this.serial = serial
    this.refresh = refresh
    this.retry = retry
    this.expiration = expiration
    this.minimum = minimum
  }

  static decode(buf: BufferCursor): ResSOA {
    return new ResSOA(
      nameUnpack(buf),
      nameUnpack(buf),
      buf.readUInt32BE(),
      buf.readUInt32BE(),
      buf.readUInt32BE(),
      buf.readUInt32BE(),
      buf.readUInt32BE()
    )
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { primary, admin, serial, refresh, retry, expiration, minimum } = this

    buf.writeUInt16BE(namePack(primary, null, index, true).length + namePack(admin, null, index, true).length + 20)
    namePack(primary, buf, index)
    namePack(admin, buf, index)
    buf.writeUInt32BE(serial)
    buf.writeUInt32BE(refresh)
    buf.writeUInt32BE(retry)
    buf.writeUInt32BE(expiration)
    buf.writeUInt32BE(minimum)

    return buf
  }
}

export class ResSRV extends PacketResource {
  priority: number
  weight: number
  port: number
  target: string

  constructor(priority: number = 0, weight: number = 0, port: number = 0, target: string = '') {
    super('', NAME_TO_QTYPE.SRV, NAME_TO_QCLASS.IN)

    this.priority = priority
    this.weight = weight
    this.port = port
    this.target = target
  }

  static decode(buf: BufferCursor): ResSRV {
    return new ResSRV(buf.readUInt16BE(), buf.readUInt16BE(), buf.readUInt16BE(), nameUnpack(buf))
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { priority, weight, port, target } = this

    buf.writeUInt16BE(namePack(target, null, index, true).length + 6)
    buf.writeUInt16BE(priority)
    buf.writeUInt16BE(weight)
    buf.writeUInt16BE(port)
    namePack(target, buf, index)

    return buf
  }
}

export class ResEDNS extends PacketResource {
  rdata: EDNSData[]

  constructor(rdata: EDNSData[] = []) {
    super('', NAME_TO_QTYPE.EDNS, 0x200, 0)
    this.rdata = rdata
  }

  static decode(buf: BufferCursor, len: number): ResEDNS {
    const rdata = []

    let i = 0
    while (i < len) {
      const optCode = buf.readUInt16BE()
      const optLen = buf.readUInt16BE()
      i += optLen + 4

      const optName = EDNS_TO_NAME[optCode]
      if (optName in ResEDNS) {
        rdata.push(ResEDNS[optName].decode(buf, optLen))
      } else {
        buf.seek(buf.tell() + optLen)
      }
    }

    return new ResEDNS(rdata)
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { rdata } = this
    const rdBuf = new BufferCursor(1024)

    for (const rd of rdata) {
      const optName = EDNS_TO_NAME[rd.ednsCode]
      if (!(optName in ResEDNS)) continue

      const optBuf = new BufferCursor(32)
      rd.encode(optBuf, index)
      rdBuf.writeUInt16BE(rd.ednsCode)
      rdBuf.writeUInt16BE(optBuf.length / 8)
      rdBuf.copy(optBuf, 0, optBuf.tell())
    }

    buf.writeUInt16BE(rdBuf.length / 8)
    buf.copy(rdBuf, 0, rdBuf.tell())

    return buf
  }

  static ECS = OptECS
}

export class ResNAPTR extends PacketResource {
  order: number
  preference: number
  flags: string
  service: string
  regexp: string
  replacement: string

  constructor(order: number = 0, preference: number = 0, flags: string = '', service: string = '', regexp: string = '', replacement: string = '') {
    super('', NAME_TO_QTYPE.NAPTR, NAME_TO_QCLASS.IN)

    this.order = order
    this.preference = preference
    this.flags = flags
    this.service = service
    this.regexp = regexp
    this.replacement = replacement
  }

  static decode(buf: BufferCursor): ResNAPTR {
    return new ResNAPTR(
      buf.readUInt16BE(),
      buf.readUInt16BE(),
      buf.toString('ascii', buf.readUInt8()),
      buf.toString('ascii', buf.readUInt8()),
      buf.toString('ascii', buf.readUInt8()),
      nameUnpack(buf)
    )
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { order, preference, flags, service, regexp, replacement } = this

    buf.writeUInt16BE(7 + flags.length + service.length + regexp.length + namePack(replacement, null, index, true).length)

    buf.writeUInt16BE(order)
    buf.writeUInt16BE(preference)
    buf.writeUInt8(flags.length)
    buf.write(flags, flags.length, 'ascii')
    buf.writeUInt8(service.length)
    buf.write(service, service.length, 'ascii')
    buf.writeUInt8(regexp.length)
    buf.write(regexp, regexp.length, 'ascii')
    namePack(replacement, buf, index)

    return buf
  }
}

export class ResTLSA extends PacketResource {
  usage: number
  selector: number
  matchingtype: number
  buf: Buffer

  constructor(usage: number = 0, selector: number = 0, matchingtype: number = 0, buf: Buffer = Buffer.alloc(0)) {
    super('', NAME_TO_QTYPE.TLSA, NAME_TO_QCLASS.IN)

    this.usage = usage
    this.selector = selector
    this.matchingtype = matchingtype
    this.buf = buf
  }

  static decode(buf: BufferCursor, len: number): ResTLSA {
    return new ResTLSA(
      buf.readUInt8(),
      buf.readUInt8(),
      buf.readUInt8(),
      buf.slice(len - 3).buffer
    )
  }

  encode(buf: BufferCursor): BufferCursor {
    const { usage, selector, matchingtype } = this

    buf.writeUInt16BE(3 + this.buf.length)

    buf.writeUInt8(usage)
    buf.writeUInt8(selector)
    buf.writeUInt8(matchingtype)
    buf.copy(this.buf)

    return buf
  }
}

export class ResSVCB extends PacketResource {
  priority: number
  target: string
  fields: { [key: number]: Buffer }

  constructor(priority: number = 0, target: string = '', fields: { [key: number]: Buffer } = {}) {
    super('', NAME_TO_QTYPE.SVCB, NAME_TO_QCLASS.IN)

    this.priority = priority
    this.target = target
    this.fields = fields
  }

  static decode(buf: BufferCursor, len: number): ResSVCB {
    const start = buf.tell()
    const priority = buf.readUInt16BE()
    const target = nameUnpack(buf)
    const fields = {}

    let i = buf.tell() - start
    while (i < len) {
      const key = buf.readUInt16BE()
      const fLen = buf.readUInt16BE()
      fields[key] = buf.slice(fLen).buffer
      i += fLen + 4
    }

    return new ResSVCB(priority, target, fields)
  }

  encode(buf: BufferCursor, index?: LableIndex): BufferCursor {
    const { priority, target, fields } = this

    buf.writeUInt16BE(2 + namePack(target, null, index, true).length + Object.values(fields).reduce((s, v) => s + 4 + v.length, 0))

    buf.writeUInt16BE(priority)
    namePack(target, buf, index)
    for (const key in fields) {
      buf.writeUInt16BE(parseInt(key))
      buf.writeUInt16BE(fields[key].length)
      buf.copy(fields[key])
    }

    return buf
  }
}

export class ResHTTPS extends ResSVCB {
  constructor(priority: number = 0, target: string = '', fields: { [key: number]: Buffer } = {}) {
    super(priority, target, fields)
    this.type = NAME_TO_QTYPE.HTTPS
  }

  static decode(buf: BufferCursor, len: number): ResHTTPS {
    const start = buf.tell()
    const priority = buf.readUInt16BE()
    const target = nameUnpack(buf)
    const fields = {}

    let i = buf.tell() - start
    while (i < len) {
      const key = buf.readUInt16BE()
      const fLen = buf.readUInt16BE()
      fields[key] = buf.slice(fLen).buffer
      i += fLen + 4
    }

    return new ResHTTPS(priority, target, fields)
  }
}

PacketResource.encoders = {
  ResA,
  ResAAAA,
  ResCNAME,
  ResEDNS,
  ResHTTPS,
  ResMX,
  ResNAPTR,
  ResNS,
  ResPTR,
  ResSOA,
  ResSPF,
  ResSRV,
  ResSVCB,
  ResTLSA,
  ResTXT
}

const parsers: { prop: string, parser: typeof PacketQuestion | typeof PacketResource, headerProp: string }[] = [
  {
    prop: 'question',
    parser: PacketQuestion,
    headerProp: 'qdcount'
  },
  {
    prop: 'answer',
    parser: PacketResource,
    headerProp: 'ancount'
  },
  {
    prop: 'authority',
    parser: PacketResource,
    headerProp: 'nscount'
  },
  {
    prop: 'additional',
    parser: PacketResource,
    headerProp: 'arcount'
  }
]

export default class DnsPacket {
  header: PacketHeader

  question: PacketQuestion[]
  answer: PacketResource[]
  authority: PacketResource[]
  additional: PacketResource[]

  constructor() {
    this.header = null
    this.question = []
    this.answer = []
    this.authority = []
    this.additional = []
  }

  static write(packet: DnsPacket, buf: Buffer | number) {
    const msg = new BufferCursor(buf)
    const { question, answer, authority, additional } = packet

    packet.header.qdcount = question.length
    packet.header.ancount = answer.length
    packet.header.nscount = authority.length
    packet.header.arcount = additional.length

    packet.header.toBuffer(msg)

    const index: LableIndex = {}
    for (const p of parsers) {
      const { prop } = p

      for (const res of <(PacketQuestion | PacketResource)[]>packet[prop]) {
        res.toBuffer(msg, index)
      }
    }

    return msg.buffer.subarray(0, msg.tell())
  }

  static parse(buf: Buffer) {
    const packet = new DnsPacket()
    const msg = new BufferCursor(buf)

    packet.header = PacketHeader.parse(msg)

    for (const p of parsers) {
      const { prop, parser, headerProp } = p
      const count = packet.header[headerProp] || 0

      for (let i = 0; i < count; i++) {
        try {
          packet[prop].push(parser.parse(msg))
        } catch (err) {
          //console.log(err)
        }
      }
    }

    return packet
  }
}

const LABEL_POINTER = 0xC0

function isPointer(len: number): boolean {
  return (len & LABEL_POINTER) === LABEL_POINTER
}

function nameUnpack(buf: BufferCursor): string {
  let len: number
  let comp: boolean
  let end: number
  let pos: number
  let part: string
  let combine = ''

  len = buf.readUInt8()
  comp = false
  end = buf.tell()

  while (len !== 0) {
    if (isPointer(len)) {
      len -= LABEL_POINTER
      len = len << 8
      pos = len + buf.readUInt8()
      if (!comp) end = buf.tell()
      buf.seek(pos)
      len = buf.readUInt8()
      comp = true
      continue
    }

    part = buf.toString('ascii', len)

    if (combine.length) combine = combine + '.' + part
    else combine = part

    len = buf.readUInt8()

    if (!comp) end = buf.tell()
  }

  buf.seek(end)

  return combine
}

function namePack(str: string, buf?: BufferCursor | Buffer, index: LableIndex = {}, indexReadOnly: boolean = false): Buffer {
  buf = buf || Buffer.alloc(1024)
  if (buf instanceof Buffer) buf = new BufferCursor(buf)

  let offset: number
  let dot: number
  let part: string

  while (str) {
    if (index[str]) {
      offset = (LABEL_POINTER << 8) + index[str]
      buf.writeUInt16BE(offset)
      break
    } else {
      if (!indexReadOnly) index[str] = buf.tell()
      dot = str.indexOf('.')

      if (dot > -1) {
        part = str.slice(0, dot)
        str = str.slice(dot + 1)
      } else {
        part = str
        str = undefined
      }

      buf.writeUInt8(part.length)
      buf.write(part, part.length, 'ascii')
    }
  }

  if (!str) buf.writeUInt8(0)

  return buf.buffer.subarray(0, buf.tell())
}