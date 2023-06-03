import Denque from "denque"

type u8 = number
type u16 = number
type u32 = number
type i32 = number
type usize = number

const EMPTY_BUFFER = Buffer.alloc(0)

const KCP_RTO_NDL: u32 = 30
const KCP_RTO_MIN: u32 = 100
const KCP_RTO_DEF: u32 = 200
const KCP_RTO_MAX: u32 = 60000

const KCP_CMD_PUSH: u8 = 81
const KCP_CMD_ACK: u8 = 82
const KCP_CMD_WASK: u8 = 83
const KCP_CMD_WINS: u8 = 84

const KCP_ASK_SEND: u32 = 1
const KCP_ASK_TELL: u32 = 2

const KCP_WND_SND: u16 = 32
//const KCP_WND_RCV: u16 = 128;
const KCP_WND_RCV: u16 = 256

const KCP_MTU_DEF: usize = 1400
// const KCP_ACK_FAST: u32 = 3;

const KCP_INTERVAL: u32 = 100
//pub const KCP_OVERHEAD: usize = 24;
const KCP_OVERHEAD: usize = 28
// const KCP_DEADLINK: u32 = 20;

const KCP_THRESH_INIT: u16 = 2
const KCP_THRESH_MIN: u16 = 2

const KCP_PROBE_INIT: u32 = 7000
const KCP_PROBE_LIMIT: u32 = 120000

/// Read `conv` from raw buffer
export function getConv(packet: Buffer) {
  return packet.readUInt32LE()
}

/// Set `conv` to raw buffer
export function setConv(packet: Buffer, conv: u32) {
  packet.writeUInt32LE(conv)
}

/// Get `token` from raw buffer
export function getToken(packet: Buffer) {
  return packet.readUInt32LE(4)
}

/// Set `token` to raw buffer
export function setToken(packet: Buffer, token: u32) {
  packet.writeUInt32LE(token, 4)
}

type KcpSegment = {
  conv: u32
  token: u32
  cmd: u8
  frg: u8
  wnd: u16
  ts: u32
  sn: u32
  una: u32
  resendTs: u32
  rto: u32
  fastAck: u32
  xmit: u32
  data: Buffer
}

function createSegment(data: Buffer): KcpSegment {
  return {
    conv: 0,
    token: 0,
    cmd: 0,
    frg: 0,
    wnd: 0,
    ts: 0,
    sn: 0,
    una: 0,
    resendTs: 0,
    rto: 0,
    fastAck: 0,
    xmit: 0,
    data,
  }
}

function encodeSegment(buf: Buffer, seg: KcpSegment) {
  const size = segmentSize(seg)
  if (buf.length < size) {
    throw Error(`buffer too small to encode kcp segment of size ${size}`)
  }

  buf.writeUInt32LE(seg.conv)
  buf.writeUInt32LE(seg.token, 4)
  buf.writeUInt8(seg.cmd, 8)
  buf.writeUInt8(seg.frg, 9)
  buf.writeUInt16LE(seg.wnd, 10)
  buf.writeUInt32LE(seg.ts, 12)
  buf.writeUInt32LE(seg.sn, 16)
  buf.writeUInt32LE(seg.una, 20)
  buf.writeUInt32LE(seg.data.length, 24)
  seg.data.copy(buf, 28)

  return size
}

function segmentSize(seg: KcpSegment) {
  return KCP_OVERHEAD + seg.data.length
}

/// Input buffer is reused internally by the KCP instance.
/// Consumers MUST copy the buffer contents if they wish to use it outside the callback.
type OutputCallback = (buf: Buffer) => void

export class Kcp {
  /// Conversation ID
  readonly conv: u32
  /// User token
  readonly token: u32

  /// Maximun Transmission Unit
  private mtu: usize
  /// Maximum Segment Size
  private mss: u32
  /// Connection state
  private state: i32

  /// First unacknowledged packet
  private sndUna: u32
  /// Next packet
  private sndNxt: u32
  /// Next packet to be received
  private rcvNxt: u32

  /// Congetion window threshole
  private ssThresh: u16

  /// ACK receive variable RTT
  private rxRttVal: u32
  /// ACK receive static RTT
  private rxsRtt: u32
  /// Resend time (calculated by ACK delay time)
  private rxRto: u32
  /// Minimal resend timeout
  private rxMinRto: u32

  /// Send window
  private sndWnd: u16
  /// Receive window
  private rcvWnd: u16
  /// Remote receive window
  private rmtWnd: u16
  /// Congetion window
  private cWnd: u16
  /// Check window
  /// - IKCP_ASK_TELL, telling window size to remote
  /// - IKCP_ASK_SEND, ask remote for window size
  private probe: u32

  /// Last update time
  private current: u32
  /// Flush interval
  private interval: u32
  /// Next flush interval
  private tsFlush: u32

  /// Enable nodelay
  private nodelay: boolean
  /// Updated has been called or not
  private updated: boolean

  /// Next check window timestamp
  private tsProbe: u32
  /// Check window wait time
  private probeWait: u32

  /// Maximum resend time
  private deadLink: u32
  /// Maximum payload size
  private incr: u32

  private sndQueue: Denque<KcpSegment>
  private rcvQueue: Denque<KcpSegment>
  private sndBuf: Denque<KcpSegment>
  private rcvBuf: Denque<KcpSegment>

  /// Pending ACK
  private acklist: Denque<[u32, u32]>
  private buf: Buffer
  private bufOffset: 0

  /// ACK number to trigger fast resend
  private fastResend: u32
  /// Disable congetion control
  private nocwnd: boolean
  /// Enable stream mode
  private stream: boolean

  private output: OutputCallback

  private zeroMsShowcase: boolean

  constructor(conv: u32, token: u32, output: OutputCallback, stream = false, zeroMsShowcase = false) {
    this.conv = conv >>> 0
    this.token = token >>> 0
    this.sndUna = 0
    this.sndNxt = 0
    this.rcvNxt = 0
    this.rxRttVal = 0
    this.rxsRtt = 0
    this.state = 0
    this.cWnd = 0
    this.probe = 0
    this.current = 0
    this.nodelay = false
    this.updated = false
    this.tsProbe = 0
    this.probeWait = 0
    this.deadLink = 10
    this.incr = 0
    this.fastResend = 0
    this.nocwnd = false
    this.stream = !!stream
    this.sndWnd = KCP_WND_SND
    this.rcvWnd = KCP_WND_RCV
    this.rmtWnd = KCP_WND_RCV
    this.mtu = KCP_MTU_DEF
    this.mss = KCP_MTU_DEF - KCP_OVERHEAD
    this.buf = Buffer.alloc((KCP_MTU_DEF + KCP_OVERHEAD) * 3)
    this.bufOffset = 0
    this.sndQueue = new Denque()
    this.rcvQueue = new Denque()
    this.sndBuf = new Denque()
    this.rcvBuf = new Denque()
    this.acklist = new Denque()
    this.rxRto = KCP_RTO_DEF
    this.rxMinRto = KCP_RTO_MIN
    this.interval = KCP_INTERVAL
    this.tsFlush = KCP_INTERVAL
    this.ssThresh = KCP_THRESH_INIT
    this.zeroMsShowcase = zeroMsShowcase
    this.output = output
  }

  /// Check buffer size without actually consuming it
  peekSize() {
    const segment = this.rcvQueue.peekFront()
    if (!segment) return -1

    if (segment.frg === 0) {
      return segment.data.length
    }

    if (this.rcvQueue.length < segment.frg + 1) {
      return -1
    }

    let len = 0

    for (let i = 0; i < this.rcvQueue.length; i++) {
      const segment = this.rcvQueue.peekAt(i)!
      len += segment.data.length
      if (segment.frg === 0) {
        break
      }
    }

    return len
  }

  // move available data from rcv_buf -> rcv_queue
  moveBuf() {
    while (!this.rcvBuf.isEmpty()) {
      const nrcvQueue = this.rcvQueue.length
      const seg = this.rcvBuf.peekFront()!

      if (seg.sn === this.rcvNxt && nrcvQueue < this.rcvWnd) {
        this.rcvNxt += 1
      } else {
        break
      }

      this.rcvBuf.shift()
      this.rcvQueue.push(seg)
    }
  }

  /// Receive data from buffer
  recv(buf: Buffer, offset = 0) {
    offset >>>= 0

    if (!Buffer.isBuffer(buf) || this.rcvQueue.isEmpty()) {
      return -1
    }

    const peekSize = this.peekSize()
    if (peekSize < 0) return -2
    if (peekSize > buf.length) return -3

    const recover = this.rcvQueue.length >= this.rcvWnd

    // Merge fragment
    let seg
    while ((seg = this.rcvQueue.shift())) {
      seg.data.copy(buf, offset)
      offset += seg.data.length
      if (seg.frg === 0) {
        break
      }
    }
    //assert(offset === peekSize);

    this.moveBuf()

    // fast recover
    if (this.rcvQueue.length < this.rcvWnd && recover) {
      this.probe |= KCP_ASK_TELL
    }

    return peekSize
  }

  /// Send bytes into buffer
  send(buf: Buffer) {
    if (!Buffer.isBuffer(buf)) {
      return -1
    }

    let sentSize = 0
    // assert(this.mss > 0)

    // append to previous segment in streaming mode (if possible)
    if (this.stream) {
      const old = this.sndQueue.peekBack()
      if (old) {
        const l = old.data.length
        if (l < this.mss) {
          const capacity = (this.mss - l) >>> 0
          const extend = Math.min(buf.length, capacity)

          const lf = buf.slice(0, extend)
          const rt = buf.slice(extend)
          old.data = Buffer.concat([old.data, lf])
          buf = rt

          old.frg = 0
          sentSize += extend
        }

        if (buf.length === 0) {
          return sentSize
        }
      }
    }

    let count: number
    if (buf.length <= this.mss) {
      count = 1
    } else {
      count = ((buf.length + this.mss - 1) / this.mss) >>> 0
    }

    if (count >= KCP_WND_RCV) {
      return -2
    }
    // assert(count > 0)

    for (let i = 0; i < count; i++) {
      const size = Math.min(this.mss, buf.length)
      const lf = buf.slice(0, size)
      const rt = buf.slice(size)

      let newSegment = createSegment(lf)
      buf = rt

      if (this.stream) {
        newSegment.frg = 0
      } else {
        newSegment.frg = ((count - i - 1) << 24) >>> 24
      }

      this.sndQueue.push(newSegment)
      sentSize += size
    }

    return sentSize
  }

  private updateAck(rtt: u32) {
    rtt >>>= 0

    if (this.rxsRtt === 0) {
      this.rxsRtt = rtt
      this.rxRttVal = (rtt / 2) >>> 0
    } else {
      let delta
      if (rtt > this.rxsRtt) {
        delta = rtt - this.rxsRtt
      } else {
        delta = this.rxsRtt - rtt
      }

      this.rxRttVal = ((3 * this.rxRttVal + delta) / 4) >>> 0
      this.rxsRtt = ((7 * this.rxsRtt + rtt) / 8) >>> 0

      if (this.rxsRtt < 1) {
        this.rxsRtt = 1
      }
    }

    const rto = this.rxsRtt + Math.max(this.interval, 4 * this.rxRttVal)
    this.rxRto = Math.max(this.rxMinRto, Math.min(rto, KCP_RTO_MAX))
  }

  private shrinkBuf() {
    const seg = this.sndBuf.peekFront()
    if (seg) {
      this.sndUna = seg.sn
    } else {
      this.sndUna = this.sndNxt
    }
  }

  private parseAck(sn: u32) {
    sn >>>= 0

    if (sn - this.sndUna < 0 || sn - this.sndNxt >= 0) {
      return
    }

    const bufSize = this.sndBuf.length
    for (let i = 0; i < bufSize; i++) {
      const seg = this.sndBuf.peekAt(i)!
      if (sn === seg.sn) {
        this.sndBuf.removeOne(i)
      } else if (sn < seg.sn) {
        break
      }
    }
  }

  private parseUna(una: u32) {
    una >>>= 0

    while (!this.sndBuf.isEmpty()) {
      if (una - this.sndBuf.peekFront()!.sn > 0) {
        this.sndBuf.shift()
      } else {
        break
      }
    }
  }

  private parseFastAck(sn: u32) {
    sn >>>= 0

    if (sn - this.sndUna < 0 || sn - this.sndNxt >= 0) {
      return
    }

    for (let i = 0; i < this.sndBuf.length; i++) {
      const seg = this.sndBuf.peekAt(i)!
      if (sn - seg.sn < 0) {
        break
      } else if (sn !== seg.sn) {
        seg.fastAck += 1
      }
    }
  }

  private ackPush(sn: u32, ts: u32) {
    this.acklist.push([sn >>> 0, ts >>> 0])
  }

  private parseData(newSegment: KcpSegment) {
    const sn = newSegment.sn

    if (sn - (this.rcvNxt + this.rcvWnd) >= 0 || sn - this.rcvNxt < 0) {
      return
    }

    let repeat = false
    let newIndex = this.rcvBuf.length

    for (let i = this.rcvBuf.length - 1; i >= 0; i--) {
      const segment = this.rcvBuf.peekAt(i)!

      if (segment.sn === sn) {
        repeat = true
        break
      } else if (sn - segment.sn > 0) {
        break
      }

      newIndex -= 1
    }

    if (!repeat) {
      this.rcvBuf.splice(newIndex, 0, newSegment)
    }

    // move available data from rcv_buf -> rcv_queue
    this.moveBuf()
  }

  /// Call this when you received a packet from raw connection
  input(buf: Buffer) {
    if (!Buffer.isBuffer(buf) || buf.length < KCP_OVERHEAD) {
      return -1
    }

    let totalRead = 0
    let flag = false
    let maxAck = 0
    const oldUna = this.sndUna

    while (buf.length >= KCP_OVERHEAD) {
      const conv = buf.readUInt32LE()
      const token = buf.readUInt32LE(4)
      const cmd = buf.readUInt8(8)
      const frg = buf.readUInt8(9)
      const wnd = buf.readUInt16LE(10)
      //Im actually interested how this causes the game to be 0ms KEK
      //TODO: figure out what the fuck is this cause this is fucking weird LMAO
      let ts = buf.readUInt32LE(12)
      if (this.zeroMsShowcase) {
        ts = ts + 100000
      }
      const sn = buf.readUInt32LE(16)
      const una = buf.readUInt32LE(20)
      const len = buf.readUInt32LE(24)

      if (conv !== this.conv) {
        return -1
      }

      if (token !== this.token) {
        return -1
      }

      if (buf.length - KCP_OVERHEAD < len) {
        return -2
      }

      switch (cmd) {
        case KCP_CMD_PUSH:
        case KCP_CMD_ACK:
        case KCP_CMD_WASK:
        case KCP_CMD_WINS:
          break

        default:
          return -3
      }

      this.rmtWnd = wnd

      this.parseUna(una)
      this.shrinkBuf()

      switch (cmd) {
        case KCP_CMD_ACK: {
          const rtt = this.current - ts
          if (rtt >= 0) {
            this.updateAck(rtt)
          }

          this.parseAck(sn)
          this.shrinkBuf()

          if (!flag) {
            maxAck = sn
            flag = true
          } else if (sn - maxAck > 0) {
            maxAck = sn
          }

          break
        }

        case KCP_CMD_PUSH: {
          if (sn - (this.rcvNxt + this.rcvWnd) < 0) {
            this.ackPush(sn, ts)
            if (sn - this.rcvNxt >= 0) {
              const sbuf = buf.slice(KCP_OVERHEAD, KCP_OVERHEAD + len)
              const segment = createSegment(sbuf)

              segment.conv = conv
              segment.token = token
              segment.cmd = cmd
              segment.frg = frg
              segment.wnd = wnd
              segment.ts = ts
              segment.sn = sn
              segment.una = una

              this.parseData(segment)
            }
          }

          break
        }

        case KCP_CMD_WASK: {
          this.probe |= KCP_ASK_TELL
          break
        }

        case KCP_CMD_WINS: {
          // Do nothing
          break
        }
      }

      totalRead += KCP_OVERHEAD + len
      buf = buf.slice(KCP_OVERHEAD + len)
    }

    if (flag) {
      this.parseFastAck(maxAck)
    }

    if (this.sndUna > oldUna && this.cWnd < this.rmtWnd) {
      const mss = this.mss
      if (this.cWnd < this.ssThresh) {
        this.cWnd += 1
        this.incr += mss
      } else {
        if (this.incr < mss) {
          this.incr = mss
        }
        this.incr += (((mss * mss) / this.incr) >>> 0) + ((mss / 16) >>> 0)
        if ((this.cWnd + 1) * mss <= this.incr) {
          this.cWnd += 1
        }
      }
      if (this.cWnd > this.rmtWnd) {
        this.cWnd = this.rmtWnd
        this.incr = this.rmtWnd * mss
      }
    }

    return totalRead
  }

  private wndUnused() {
    if (this.rcvQueue.length < this.rcvWnd) {
      return this.rcvWnd - ((this.rcvQueue.length << 16) >>> 16)
    } else {
      return 0
    }
  }

  private _flushAck(segment: KcpSegment) {
    // flush acknowledges
    for (let i = 0; i < this.acklist.length; i++) {
      const [sn, ts] = this.acklist.peekAt(i)!
      if (this.bufOffset + KCP_OVERHEAD > this.mtu) {
        this.output(this.buf.slice(0, this.bufOffset))
        this.bufOffset = 0
      }

      segment.sn = sn
      segment.ts = ts

      this.bufOffset += encodeSegment(this.buf.slice(this.bufOffset), segment)
    }

    this.acklist.clear()
  }

  private probeWndSize() {
    // probe window size (if remote window size equals zero)
    if (this.rmtWnd === 0) {
      if (this.probeWait === 0) {
        this.probeWait = KCP_PROBE_INIT
        this.tsProbe = this.current + this.probeWait
      } else {
        if (this.current - this.tsProbe >= 0 && this.probeWait < KCP_PROBE_INIT) {
          this.probeWait = KCP_PROBE_INIT
        }
        this.probeWait += (this.probeWait / 2) >>> 0
        if (this.probeWait > KCP_PROBE_LIMIT) {
          this.probeWait = KCP_PROBE_LIMIT
        }
        this.tsProbe = this.current + this.probeWait
        this.probe |= KCP_ASK_SEND
      }
    } else {
      this.tsProbe = 0
      this.probeWait = 0
    }
  }

  private _flushProbeCommands(cmd: u8, segment: KcpSegment) {
    cmd = (cmd << 24) >>> 24
    segment.cmd = cmd

    if (this.bufOffset + KCP_OVERHEAD > this.mtu) {
      this.output(this.buf.slice(0, this.bufOffset))
      this.bufOffset = 0
    }

    this.bufOffset += encodeSegment(this.buf.slice(this.bufOffset), segment)
  }

  private flushProbeCommands(segment: KcpSegment) {
    // flush window probing commands
    if ((this.probe & KCP_ASK_SEND) !== 0) {
      this._flushProbeCommands(KCP_CMD_WASK, segment)
    }

    // flush window probing commands
    if ((this.probe & KCP_ASK_TELL) !== 0) {
      this._flushProbeCommands(KCP_CMD_WINS, segment)
    }

    this.probe = 0
  }

  /// Flush pending ACKs
  flushAck() {
    if (!this.updated) {
      return
    }

    const segment = createSegment(EMPTY_BUFFER)
    segment.conv = this.conv
    segment.cmd = KCP_CMD_ACK
    segment.wnd = this.wndUnused()
    segment.una = this.rcvNxt

    this._flushAck(segment)
  }

  /// Flush pending data in buffer.
  flush() {
    if (!this.updated) {
      return
    }

    const segment = createSegment(EMPTY_BUFFER)
    segment.conv = this.conv
    segment.token = this.token
    segment.cmd = KCP_CMD_ACK
    segment.wnd = this.wndUnused()
    segment.una = this.rcvNxt

    this._flushAck(segment)
    this.probeWndSize()
    this.flushProbeCommands(segment)

    // calculate window size
    let cWnd = Math.min(this.sndWnd, this.rmtWnd)
    if (!this.nocwnd) {
      cWnd = Math.min(this.cWnd, cWnd)
    }

    // move data from snd_queue to snd_buf
    while (this.sndNxt - (this.sndUna + cWnd) < 0) {
      const newSegment = this.sndQueue.shift()
      if (!newSegment) break

      newSegment.conv = this.conv
      newSegment.token = this.token
      newSegment.cmd = KCP_CMD_PUSH
      newSegment.wnd = segment.wnd
      newSegment.ts = this.current
      newSegment.sn = this.sndNxt
      this.sndNxt += 1
      newSegment.una = this.rcvNxt
      newSegment.resendTs = this.current
      newSegment.rto = this.rxRto
      newSegment.fastAck = 0
      newSegment.xmit = 0
      this.sndBuf.push(newSegment)
    }

    // calculate resent
    const resent = this.fastResend > 0 ? this.fastResend : 0xffffffff
    const rtoMin = !this.nodelay ? this.rxRto >>> 3 : 0

    let lost = false
    let change = 0

    for (let i = 0; i < this.sndBuf.length; i++) {
      const sndSegment = this.sndBuf.peekAt(i)!
      let needSend = false

      if (sndSegment.xmit === 0) {
        needSend = true
        sndSegment.xmit += 1
        sndSegment.rto = this.rxRto
        sndSegment.resendTs = this.current + sndSegment.rto + rtoMin
      } else if (this.current - sndSegment.resendTs >= 0) {
        needSend = true
        sndSegment.xmit += 1
        if (!this.nodelay) {
          sndSegment.rto += this.rxRto
        } else {
          sndSegment.rto += (this.rxRto / 2) >>> 0
        }
        sndSegment.resendTs = this.current + sndSegment.rto
        lost = true
      } else if (sndSegment.fastAck >= resent) {
        needSend = true
        sndSegment.xmit += 1
        sndSegment.fastAck = 0
        sndSegment.resendTs = this.current + sndSegment.rto
        change += 1
      }

      if (needSend) {
        sndSegment.ts = this.current
        sndSegment.wnd = segment.wnd
        sndSegment.una = this.rcvNxt

        const need = KCP_OVERHEAD + sndSegment.data.length

        if (this.bufOffset + need > this.mtu) {
          this.output(this.buf.slice(0, this.bufOffset))
          this.bufOffset = 0
        }

        this.bufOffset += encodeSegment(this.buf.slice(this.bufOffset), sndSegment)

        if (sndSegment.xmit >= this.deadLink) {
          this.state = -1
        }
      }
    }

    // Flush all data in buffer
    if (this.bufOffset > 0) {
      this.output(this.buf.slice(0, this.bufOffset))
      this.bufOffset = 0
    }

    // update ssthresh
    if (change > 0) {
      const inflight = (this.sndNxt - this.sndUna) >>> 0
      this.ssThresh = (((inflight << 16) >>> 16) / 2) >>> 0
      if (this.ssThresh < KCP_THRESH_MIN) {
        this.ssThresh = KCP_THRESH_MIN
      }
      this.cWnd = this.ssThresh + ((resent << 16) >>> 16)
      this.incr = this.cWnd * this.mss
    }

    if (lost) {
      this.ssThresh = (cWnd / 2) >>> 0
      if (this.ssThresh < KCP_THRESH_MIN) {
        this.ssThresh = KCP_THRESH_MIN
      }
      this.cWnd = 1
      this.incr = this.mss
    }

    if (this.cWnd < 1) {
      this.cWnd = 1
      this.incr = this.mss
    }
  }

  /// Update state every 10ms ~ 100ms.
  ///
  /// Or you can ask `check` when to call this again.
  update(current: u32) {
    current >>>= 0
    this.current = current

    if (!this.updated) {
      this.updated = true
      this.tsFlush = this.current
    }

    let slap = this.current - this.tsFlush

    if (slap >= 10000 || slap < -10000) {
      this.tsFlush = this.current
      slap = 0
    }

    if (slap >= 0) {
      this.tsFlush += this.interval
      if (this.current - this.tsFlush >= 0) {
        this.tsFlush = this.current + this.interval
      }
      this.flush()
    }
  }

  /// Determine when you should call `update`.
  /// Return when you should invoke `update` in millisec, if there is no `input`/`send` calling.
  /// You can call `update` in that time without calling it repeatly.
  check(current: u32) {
    current >>>= 0

    if (!this.updated) {
      return 0
    }

    let tsFlush = this.tsFlush
    let tmPacket = 0xffffffff

    if (current - tsFlush >= 10000 || current - tsFlush < -10000) {
      tsFlush = current
    }

    if (current - tsFlush >= 0) {
      // return this.interval;
      return 0
    }

    let tmFlush = (tsFlush - current) >>> 0
    for (let i = 0; i < this.sndBuf.length; i++) {
      const seg = this.sndBuf.peekAt(i)!
      const diff = seg.resendTs - current
      if (diff <= 0) {
        // return this.interval;
        return 0
      }
      if (diff < tmPacket) {
        tmPacket = diff
      }
    }

    return Math.min(tmPacket, tmFlush, this.interval)
  }

  /// Change MTU size, default is 1400
  ///
  /// MTU = Maximum Transmission Unit
  setMtu(mtu: usize) {
    mtu = Math.max(mtu >>> 0, 50, KCP_OVERHEAD)

    this.mtu = mtu
    this.mss = (mtu - KCP_OVERHEAD) >>> 0
    this.buf = Buffer.alloc((mtu + KCP_OVERHEAD) * 3)
  }

  /// Get MTU
  getMtu() {
    return this.mtu
  }

  /// Set check interval
  setInterval(interval: u32) {
    this.interval = Math.max(10, Math.min(interval >>> 0, 5000))
  }

  /// Set nodelay
  ///
  /// fastest config: nodelay(true, 20, 2, true)
  ///
  /// `nodelay`: default is disable (false)
  /// `resend`: 0:disable fast resend(default), 1:enable fast resend
  /// `nc`: `false`: normal congestion control(default), `true`: disable congestion control
  setNodelay(nodelay: boolean, resend: i32, nc: boolean) {
    if (nodelay) {
      this.nodelay = true
      this.rxMinRto = KCP_RTO_NDL
    } else {
      this.nodelay = false
      this.rxMinRto = KCP_RTO_MIN
    }

    this.fastResend = Math.max(0, resend >>> 0)
    this.nocwnd = !!nc
  }

  /// Set `wndsize`
  /// set maximum window size: `sndwnd=32`, `rcvwnd=32` by default
  setWndSize(sndWnd: u16, rcvWnd: u16) {
    this.sndWnd = (sndWnd << 16) >>> 16
    this.rcvWnd = Math.max((rcvWnd << 16) >>> 16, KCP_WND_RCV)
  }

  /// `snd_wnd` Send window
  getSndWnd() {
    return this.sndWnd
  }

  /// `rcv_wnd` Receive window
  getRcvWnd() {
    return this.rcvWnd
  }

  /// Get `waitsnd`, how many packet is waiting to be sent
  getWaitSnd() {
    return this.sndBuf.length + this.sndQueue.length
  }

  /// Set `rx_minrto`
  setRxMinRto(rto: u32) {
    this.rxMinRto = rto >>> 0
  }

  /// Set `fastresend`
  setFastResend(fr: u32) {
    this.fastResend = fr >>> 0
  }

  /// KCP header size
  getHeaderLen() {
    return KCP_OVERHEAD
  }

  /// Enabled stream or not
  isStream() {
    return this.stream
  }

  /// Maximum Segment Size
  getMss() {
    return this.mss
  }

  /// Set maximum resend times
  setMaxResend(deadLink: u32) {
    this.deadLink = deadLink >>> 0
  }

  /// Check if KCP connection is dead (resend times excceeded)
  isDeadLink() {
    return this.state !== 0
  }
}
