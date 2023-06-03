import { getFieldOffset, mHeaderFields, mLiteral, sizeofStruct } from "./mhyCrypto/metadatastring"

export interface StringLiteralPointer {
  offset: number
  length: number
}

export interface StringLiteralInfo {
  pointers: StringLiteralPointer[]
  data: Buffer
}

export function getStringLiteralInfo(data: Buffer): StringLiteralInfo {
  const len = data.length

  if (len < sizeofStruct(mHeaderFields)) {
    throw new Error("data not big enough for global metadata header")
  }

  const header = data.subarray(0, sizeofStruct(mHeaderFields))

  const stringLiteralCount = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralCount"))
  const stringLiteralOffset = header.readUInt32LE(getFieldOffset(mHeaderFields, "stringLiteralOffset"))
  const stringLiteralDataOffset = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralDataOffset"))
  if (stringLiteralCount + stringLiteralOffset > len) {
    throw new Error("file trimmed or string literal offset/count field invalid")
  }

  const pointers = []
  const info: StringLiteralInfo = {
    pointers,
    data: null,
  }

  let dataSize = 0

  const literals = data.subarray(stringLiteralOffset)
  const count = stringLiteralCount / sizeofStruct(mLiteral)
  for (let i = 0; i < count; i++) {
    const soff = literals.readUInt32LE(i << 3)
    const slen = literals.readUInt32LE((i << 3) + 4)

    if (stringLiteralDataOffset + soff + slen > len) {
      throw new Error("file trimmed or contains invalid string entry")
    }

    pointers.push({ offset: soff, length: slen })
    dataSize = Math.max(dataSize, soff + slen)
  }

  info.data = data.subarray(stringLiteralDataOffset, stringLiteralDataOffset + dataSize)

  return info
}

export function replaceStringLiteral(data: Buffer, pointer: StringLiteralPointer, newStr: Buffer): Buffer {
  const clone = Buffer.alloc(data.length)
  data.copy(clone)
  data = clone

  const len = data.length

  if (len < sizeofStruct(mHeaderFields)) {
    throw new Error("data not big enough for global metadata header")
  }

  const header = data.subarray(0, sizeofStruct(mHeaderFields))

  const stringLiteralCount = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralCount"))
  const stringLiteralOffset = header.readUInt32LE(getFieldOffset(mHeaderFields, "stringLiteralOffset"))
  const stringLiteralDataCount = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralDataCount"))
  const stringLiteralDataOffset = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralDataOffset"))

  if (stringLiteralCount + stringLiteralOffset > len) {
    throw new Error("file trimmed or string literal offset/count field invalid")
  }

  const { offset, length } = pointer
  const diff = newStr.length - length

  // change stringLiteralDataCount
  header.writeUint32LE(stringLiteralDataCount + diff, getFieldOffset(mHeaderFields, "stringLiteralDataCount"))

  // change header offsets
  for (let i = 0; i < mHeaderFields.length; i += 2) {
    const [fname] = mHeaderFields[i]

    const foffset = getFieldOffset(mHeaderFields, fname)
    const fval = header.readUint32LE(foffset)

    if (fval <= stringLiteralDataOffset) continue

    header.writeUint32LE(fval + diff, foffset)
  }

  const literals = Buffer.alloc(stringLiteralCount)
  data.copy(literals, 0, stringLiteralOffset)

  const count = stringLiteralCount / sizeofStruct(mLiteral)
  for (let i = 0; i < count; i++) {
    const soff = literals.readUInt32LE(i << 3)
    const slen = literals.readUInt32LE((i << 3) + 4)

    if (stringLiteralDataOffset + soff + slen > len) {
      throw new Error("file trimmed or contains invalid string entry")
    }

    if (soff === offset) {
      const prefix = data.subarray(0, stringLiteralDataOffset + soff)
      const suffix = data.subarray(stringLiteralDataOffset + soff + slen)

      // change length
      literals.writeUInt32LE(newStr.length, (i << 3) + 4)

      // replace string
      data = Buffer.concat([prefix, newStr, suffix])
    } else if (soff > offset) {
      // change offset
      literals.writeUInt32LE(soff + diff, i << 3)
    }
  }

  // update literals
  literals.copy(data, header.readUInt32LE(getFieldOffset(mHeaderFields, "stringLiteralOffset")))

  return data
}
