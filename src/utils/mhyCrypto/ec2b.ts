import MT19937 from "../mt19937"

import { mhy128Enc } from "./aes"
import { aesXorpad, keyXorpad } from "./magic"

export function keyScramble(key: Buffer): void {
  const roundKeys = Buffer.alloc(11 * 16)
  for (let round = 0; round <= 10; round++) {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        const idx = (round << 8) + i * 16 + j
        roundKeys[round * 16 + i] ^= aesXorpad[1][idx] ^ aesXorpad[0][idx]
      }
    }
  }

  const chip = Buffer.alloc(16)
  mhy128Enc(key, roundKeys, chip)
  chip.copy(key)
}

export function getDecryptVector(key: Buffer, crypt: Buffer, output: Buffer): void {
  let val = 0xffffffffffffffffn
  for (let i = 0; i < crypt.length >> 3; i++) {
    val = crypt.readBigInt64LE(i << 3) ^ val
  }

  const mt = new MT19937()
  mt.seed(key.readBigUInt64LE(8) ^ 0xceac3b5a867837acn ^ val ^ key.readBigInt64LE())

  for (let i = 0; i < output.length >> 3; i++) {
    output.writeBigUInt64LE(mt.int64(), i << 3)
  }
}

export function getEc2bKey(buf: Buffer): Buffer {
  const xorpad = Buffer.alloc(4096)

  if (!Buffer.isBuffer(buf) || buf.length < 8 || buf.readUint32LE() !== 0x62326345) return xorpad

  const keyLen = buf.readUInt32LE(4)
  if (buf.length < 8 + keyLen + 4) return xorpad
  const dataLen = buf.readUint32LE(8 + keyLen)
  if (buf.length < 8 + keyLen + 4 + dataLen) return xorpad

  const key = buf.subarray(8, 8 + keyLen)
  const data = buf.subarray(12 + keyLen, 12 + keyLen + dataLen)

  keyScramble(key)
  for (let i = 0; i < 16; i++) key[i] ^= keyXorpad[i]

  getDecryptVector(key, data, xorpad)

  return xorpad
}

export function genEc2b(keySize = 16, dataSize = 2048): Buffer {
  const key = Buffer.alloc(keySize)
  const data = Buffer.alloc(dataSize)

  for (let i = 0; i < keySize; i++) key[i] = Math.floor(0x100 * Math.random())
  for (let i = 0; i < dataSize; i++) data[i] = Math.floor(0x100 * Math.random())

  const buf = Buffer.alloc(12 + keySize + dataSize)

  buf.writeUInt32LE(0x62326345, 0)
  buf.writeUInt32LE(keySize, 4)
  key.copy(buf, 8)
  buf.writeUint32LE(dataSize, 8 + keySize)
  data.copy(buf, 12 + keySize)

  return buf
}
