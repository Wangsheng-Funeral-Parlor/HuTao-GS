import MT19937 from '../mt19937'
import { initialPrevXor } from './magic'
import { memecryptoDecrypt, memecryptoEncrypt, memecryptoPrepareKey } from './memecrypto'
import { generateKeyForGlobalMetadataHeaderString, recryptGlobalMetadataHeaderStringFields, recryptGlobalMetadataHeaderStringLiterals } from './metadatastring'

export const getGlobalMetadataKeys = (src: Buffer, srcn: number, longkey: Buffer, shortkey: Buffer): boolean => {
  if (srcn != 0x4000) return false

  if (src.readUInt16LE(0xc8) != 0xfc2e || src.readUInt16LE(0xca) != 0x2cfe) return true

  const offB00 = src.readUInt16LE(0xd2)

  for (let i = 0; i < 16; i++) {
    shortkey[i] = src[offB00 + i] ^ src[0x3000 + i]
  }

  for (let i = 0; i < 0xb00; i++) {
    longkey[i] = src[offB00 + 0x10 + i] ^ src[0x3000 + 0x10 + i] ^ shortkey[i % 16]
  }

  return true
}

export const genGlobalMetadataKey = (src: Buffer, srcn: number): boolean => {
  if (srcn != 0x4000) return false

  if (src.readUInt16LE(0xc8) === 0xfc2e && src.readUInt16LE(0xca) === 0x2cfe) return true

  const mt = new MT19937()
  mt.seed(0xDEADBEEFn)

  for (let i = 0; i < srcn >> 3; i++) {
    src.writeBigUInt64LE(mt.int64(), i << 3)
  }

  src.writeUInt16LE(0xfc2e, 0xc8) // Magic
  src.writeUInt16LE(0x2cfe, 0xca) // Magic
  src.writeUInt16LE(Number(mt.int64() & 0x1FFFn), 0xd2) // Just some random value

  return true
}

export const decryptGlobalMetadata = (data: Buffer): void => {
  const size = data.length

  const longkey = Buffer.alloc(0xB00)
  const longkeyp = Buffer.alloc(0xB0)
  const shortkey = Buffer.alloc(16)

  getGlobalMetadataKeys(data.subarray(-0x4000), 0x4000, longkey, shortkey)

  for (let i = 0; i < 16; i++) shortkey[i] ^= initialPrevXor[i]

  memecryptoPrepareKey(longkey, longkeyp)

  const perentry = Math.floor(size / 0x100 / 0x40)
  for (let i = 0; i < 0x100; i++) {
    const off = Math.floor((0x40 * perentry) * i)

    const prev = Buffer.alloc(16)
    shortkey.copy(prev)
    for (let j = 0; j < 4; j++) {
      const curr = Buffer.alloc(16)
      data.copy(curr, 0, off + j * 0x10)

      memecryptoDecrypt(longkeyp, curr)

      for (let k = 0; k < 16; k++) curr[k] ^= prev[k]

      data.copy(prev, 0, off + j * 0x10)
      curr.copy(data, off + j * 0x10)
    }
  }

  const literalDecKey = Buffer.alloc(0x5000)
  recryptGlobalMetadataHeaderStringFields(data, size, literalDecKey)
  recryptGlobalMetadataHeaderStringLiterals(data, size, literalDecKey)
}

export const encryptGlobalMetadata = (data: Buffer): void => {
  const size = data.length

  const literalDecKey = Buffer.alloc(0x5000)

  genGlobalMetadataKey(data.subarray(-0x4000), 0x4000)

  generateKeyForGlobalMetadataHeaderString(data, size, literalDecKey)

  recryptGlobalMetadataHeaderStringLiterals(data, size, literalDecKey)
  recryptGlobalMetadataHeaderStringFields(data, size, literalDecKey)

  const longkey = Buffer.alloc(0xB00)
  const longkeyp = Buffer.alloc(0xB0)
  const shortkey = Buffer.alloc(16)

  getGlobalMetadataKeys(data.subarray(-0x4000), 0x4000, longkey, shortkey)

  for (let i = 0; i < 16; i++) shortkey[i] ^= initialPrevXor[i]

  memecryptoPrepareKey(longkey, longkeyp)

  const perentry = Math.floor(size / 0x100 / 0x40)
  for (let i = 0; i < 0x100; i++) {
    const off = Math.floor((0x40 * perentry) * i)

    const prev = Buffer.alloc(16)
    shortkey.copy(prev)
    for (let j = 0; j < 4; j++) {
      const curr = Buffer.alloc(16)
      data.copy(curr, 0, off + j * 0x10)

      for (let k = 0; k < 16; k++) curr[k] ^= prev[k]

      memecryptoEncrypt(longkeyp, curr)

      curr.copy(prev)
      curr.copy(data, off + j * 0x10)
    }
  }
}