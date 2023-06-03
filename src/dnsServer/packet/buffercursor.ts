import VError from "verror"

export default class BufferCursor {
  private _pos: number

  buffer: Buffer
  length: number

  constructor(buff: Buffer | number) {
    this._pos = 0

    this.buffer = Buffer.isBuffer(buff) ? buff : Buffer.alloc(buff)
    this.length = this.buffer.length
  }

  private _move(step: number) {
    this._checkWrite(step)
    this._pos += step
  }

  private _checkWrite(size: number) {
    let shouldThrow = false

    const length = this.length
    const pos = this._pos

    if (size > length) shouldThrow = true
    if (length - pos < size) shouldThrow = true

    if (shouldThrow) throw new BufferCursorOverflow(length, pos, size)
  }

  seek(pos: number) {
    if (pos < 0)
      throw new VError(
        new RangeError("Cannot seek before start of buffer"),
        "Negative seek values not allowed: %d",
        pos
      )
    if (pos > this.length)
      throw new VError(
        new RangeError("Trying to seek beyond buffer"),
        "Requested %d position is beyond length %d",
        pos,
        this.length
      )

    this._pos = pos
    return this
  }

  eof() {
    return this._pos == this.length
  }

  toByteArray(method: string) {
    const { buffer } = this
    const arr: number[] = []
    let part: number

    if (!method) {
      method = "readUInt8"
      part = 1
    }

    if (method.indexOf("16") > 0) part = 2
    else if (method.indexOf("32") > 0) part = 4

    for (let i = 0; i < buffer.length; i += part) {
      arr.push(buffer[method](i))
    }

    return arr
  }

  tell() {
    return this._pos
  }

  slice(length?: number) {
    let end: number
    if (length === undefined) {
      end = this.length
    } else {
      end = this._pos + length
    }

    const b = new BufferCursor(this.buffer.subarray(this._pos, end))
    this.seek(end)
    return b
  }

  toString(encoding: BufferEncoding, length?: number) {
    let end: number
    if (length === undefined) {
      end = this.length
    } else {
      end = this._pos + length
    }

    if (!encoding) {
      encoding = "utf8"
    }

    const ret = this.buffer.toString(encoding, this._pos, end)
    this.seek(end)
    return ret
  }

  // This method doesn't need to _checkWrite because Buffer implicitly truncates
  // to the length of the buffer, it's the only method in Node core that behaves
  // this way by default
  write(value: string, length: number, encoding: BufferEncoding) {
    const ret = this.buffer.write(value, this._pos, length, encoding)
    this._move(ret)
    return this
  }

  fill(value: number, length?: number) {
    let end: number

    if (length === undefined) {
      end = this.length
    } else {
      end = this._pos + length
    }

    this._checkWrite(end - this._pos)

    this.buffer.fill(value, this._pos, end)
    this.seek(end)
    return this
  }

  // This prototype is not entirely like the upstream Buffer.copy, instead it
  // is the target buffer, and accepts the source buffer -- since the target
  // buffer knows its starting position
  copy(source: BufferCursor | Buffer, sourceStart?: number, sourceEnd?: number) {
    const sBC = source instanceof BufferCursor

    if (isNaN(sourceEnd)) sourceEnd = source.length

    if (isNaN(sourceStart)) {
      if (sBC) sourceStart = source._pos
      else sourceStart = 0
    }

    const length = sourceEnd - sourceStart
    this._checkWrite(length)

    const buf = sBC ? source.buffer : source
    buf.copy(this.buffer, this._pos, sourceStart, sourceEnd)

    this._move(length)
    return this
  }

  readUInt8() {
    const ret = this.buffer.readUInt8(this._pos)
    this._move(1)
    return ret
  }

  readInt8() {
    const ret = this.buffer.readInt8(this._pos)
    this._move(1)
    return ret
  }

  readInt16BE() {
    const ret = this.buffer.readInt16BE(this._pos)
    this._move(2)
    return ret
  }

  readInt16LE() {
    const ret = this.buffer.readInt16LE(this._pos)
    this._move(2)
    return ret
  }

  readUInt16BE() {
    const ret = this.buffer.readUInt16BE(this._pos)
    this._move(2)
    return ret
  }

  readUInt16LE() {
    const ret = this.buffer.readUInt16LE(this._pos)
    this._move(2)
    return ret
  }

  readUInt32LE() {
    const ret = this.buffer.readUInt32LE(this._pos)
    this._move(4)
    return ret
  }

  readUInt32BE() {
    const ret = this.buffer.readUInt32BE(this._pos)
    this._move(4)
    return ret
  }

  readInt32LE() {
    const ret = this.buffer.readInt32LE(this._pos)
    this._move(4)
    return ret
  }

  readInt32BE() {
    const ret = this.buffer.readInt32BE(this._pos)
    this._move(4)
    return ret
  }

  readFloatBE() {
    const ret = this.buffer.readFloatBE(this._pos)
    this._move(4)
    return ret
  }

  readFloatLE() {
    const ret = this.buffer.readFloatLE(this._pos)
    this._move(4)
    return ret
  }

  readDoubleBE() {
    const ret = this.buffer.readDoubleBE(this._pos)
    this._move(8)
    return ret
  }

  readDoubleLE() {
    const ret = this.buffer.readDoubleLE(this._pos)
    this._move(8)
    return ret
  }

  writeUInt8(value: number) {
    this._checkWrite(1)
    this.buffer.writeUInt8(value, this._pos)
    this._move(1)
    return this
  }

  writeInt8(value: number) {
    this._checkWrite(1)
    this.buffer.writeInt8(value, this._pos)
    this._move(1)
    return this
  }

  writeUInt16BE(value: number) {
    this._checkWrite(2)
    this.buffer.writeUInt16BE(value, this._pos)
    this._move(2)
    return this
  }

  writeUInt16LE(value: number) {
    this._checkWrite(2)
    this.buffer.writeUInt16LE(value, this._pos)
    this._move(2)
    return this
  }

  writeInt16BE(value: number) {
    this._checkWrite(2)
    this.buffer.writeInt16BE(value, this._pos)
    this._move(2)
    return this
  }

  writeInt16LE(value: number) {
    this._checkWrite(2)
    this.buffer.writeInt16LE(value, this._pos)
    this._move(2)
    return this
  }

  writeUInt32BE(value: number) {
    this._checkWrite(4)
    this.buffer.writeUInt32BE(value, this._pos)
    this._move(4)
    return this
  }

  writeUInt32LE(value: number) {
    this._checkWrite(4)
    this.buffer.writeUInt32LE(value, this._pos)
    this._move(4)
    return this
  }

  writeInt32BE(value: number) {
    this._checkWrite(4)
    this.buffer.writeInt32BE(value, this._pos)
    this._move(4)
    return this
  }

  writeInt32LE(value: number) {
    this._checkWrite(4)
    this.buffer.writeInt32LE(value, this._pos)
    this._move(4)
    return this
  }

  writeFloatBE(value: number) {
    this._checkWrite(4)
    this.buffer.writeFloatBE(value, this._pos)
    this._move(4)
    return this
  }

  writeFloatLE(value: number) {
    this._checkWrite(4)
    this.buffer.writeFloatLE(value, this._pos)
    this._move(4)
    return this
  }

  writeDoubleBE(value: number) {
    this._checkWrite(8)
    this.buffer.writeDoubleBE(value, this._pos)
    this._move(8)
    return this
  }

  writeDoubleLE(value: number) {
    this._checkWrite(8)
    this.buffer.writeDoubleLE(value, this._pos)
    this._move(8)
    return this
  }
}

export class BufferCursorOverflow extends VError {
  kind: string
  length: number
  position: number
  size: number

  constructor(length, pos, size) {
    super("BufferCursorOverflow: length %d, position %d, size %d", length, pos, size)

    this.kind = "BufferCursorOverflow"
    this.length = length
    this.position = pos
    this.size = size
  }
}
