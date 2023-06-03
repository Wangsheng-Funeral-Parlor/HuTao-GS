export class Handshake {
  static MAGIC_CONNECT = [0xff, 0xffffffff]
  static MAGIC_SEND_BACK_CONV = [0x145, 0x14514545]
  static MAGIC_DISCONNECT = [0x194, 0x19419494]

  Magic1: number
  Conv: number
  Token: number
  Data: number
  Magic2: number
  buffer: Buffer

  constructor(magic: number[] = [0x0, 0x0], conv = 0, token = 0, data = 0) {
    this.Magic1 = magic[0]
    this.Conv = conv
    this.Token = token
    this.Data = data
    this.Magic2 = magic[1]
    this.buffer = null
  }

  decode(data: Buffer): void {
    const dataBuffer = Buffer.from(data)

    this.Magic1 = dataBuffer.readUInt32BE(0)
    this.Conv = dataBuffer.readUInt32BE(4)
    this.Token = dataBuffer.readUInt32BE(8)
    this.Data = dataBuffer.readUInt32BE(12)
    this.Magic2 = dataBuffer.readUInt32BE(16)

    this.buffer = dataBuffer
  }

  encode(): void {
    const buffer = Buffer.alloc(20)

    buffer.writeUInt32BE(this.Magic1, 0)
    buffer.writeUInt32BE(this.Conv, 4)
    buffer.writeUInt32BE(this.Token, 8)
    buffer.writeUInt32BE(this.Data, 12)
    buffer.writeUInt32BE(this.Magic2, 16)

    this.buffer = buffer
  }
}

export default (data: Buffer): Handshake => {
  const type = data.readUInt32BE(0)

  switch (type) {
    case 255: {
      // 0xFF -- NEW CONNECTION
      const handshakeReq = new Handshake()
      handshakeReq.decode(data)

      const _Conv = Math.floor(Date.now() / 1000)
      const _Token = (0xffcceebb ^ ((Date.now() >> 32) & 0xffffffff)) >>> 0
      const _Data = handshakeReq.Data

      const handshakeRes = new Handshake(Handshake.MAGIC_SEND_BACK_CONV, _Conv, _Token, _Data)
      handshakeRes.encode()

      return handshakeRes
    }
    case 404: {
      // 0x194 -- DISCONNECTION
      const handshakeReq = new Handshake()
      handshakeReq.decode(data)

      const _Conv = handshakeReq.Conv
      const _Token = handshakeReq.Token
      const _Data = handshakeReq.Data

      const handshakeRes = new Handshake(Handshake.MAGIC_DISCONNECT, _Conv, _Token, _Data)
      handshakeRes.encode()

      return handshakeRes
    }
    default:
      return null
  }
}
