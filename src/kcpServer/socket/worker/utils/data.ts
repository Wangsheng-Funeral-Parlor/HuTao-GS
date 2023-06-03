export enum DataType {
  NULL,
  BUFFER,
  STRING,
  BOOL,
  BIGINT,
  INT32,
  FLOAT,
}

export type AcceptTypes = Buffer | string | boolean | bigint | number | null

export function sizeOf(buf: Buffer, offset = 0) {
  if (buf.length < offset + 1) return -1

  const type = buf.readUInt8(offset) & 0x7f
  switch (type) {
    case DataType.NULL:
      return 1
    case DataType.BUFFER:
    case DataType.STRING:
      if (buf.length < offset + 5) return -1
      return 5 + buf.readUInt32LE(offset + 1)
    case DataType.BOOL:
      return 1
    case DataType.BIGINT:
      return 9
    case DataType.INT32:
    case DataType.FLOAT:
      return 5
    default:
      return -1
  }
}

export function encodeData(data: AcceptTypes): Buffer {
  if (data == null) return Buffer.from([DataType.NULL])

  const dataType = typeof data
  switch (typeof data) {
    case "string":
      data = Buffer.from(data, "utf8")
    // convert string to buffer
    case "object": {
      if (!Buffer.isBuffer(data)) throw new Error("Invalid data type")
      const len = data.length
      const buf = Buffer.alloc(5 + len)
      buf.writeUInt8(dataType === "string" ? DataType.STRING : DataType.BUFFER)
      buf.writeUInt32LE(len, 1)
      data.copy(buf, 5)
      return buf
    }
    case "boolean": {
      return Buffer.from([DataType.BOOL | (Number(!!data) << 7)])
    }
    case "bigint": {
      const buf = Buffer.alloc(9)
      buf.writeUInt8(DataType.BIGINT)
      buf.writeBigUInt64LE(data, 1)
      return buf
    }
    case "number": {
      const buf = Buffer.alloc(5)
      if (Number(data) % 1 === 0) {
        buf.writeUInt8(DataType.INT32)
        buf.writeUInt32LE(data, 1)
      } else {
        buf.writeUInt8(DataType.FLOAT)
        buf.writeFloatLE(data, 1)
      }
      return buf
    }
    default:
      throw new Error("Invalid data type")
  }
}

export function decodeData(buf: Buffer, offset = 0): AcceptTypes {
  const type = buf.readUInt8(offset) & 0x7f
  const data = buf.subarray(offset + 1)

  switch (type) {
    case DataType.NULL: {
      return null
    }
    case DataType.BUFFER:
    case DataType.STRING: {
      const out = Buffer.alloc(sizeOf(buf, offset) - 5)
      data.copy(out, 0, 4)
      if (type === DataType.BUFFER) return out
      return out.toString("utf8")
    }
    case DataType.BOOL: {
      return buf.readUInt8(offset) >> 7 !== 0
    }
    case DataType.BIGINT: {
      return data.readBigUInt64LE()
    }
    case DataType.INT32: {
      return data.readUInt32LE()
    }
    case DataType.FLOAT: {
      return data.readFloatLE()
    }
    default:
      throw new Error("Invalid data type")
  }
}

export function decodeDataList(buf: Buffer, offset = 0): AcceptTypes[] {
  const output: AcceptTypes[] = []

  while (true) {
    const size = sizeOf(buf, offset)
    if (size <= 0) break

    output.push(decodeData(buf, offset))
    offset += size
  }

  return output
}
