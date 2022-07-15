import { mhy128Dec, mhy128Enc } from './aes'

export const dexor16 = (c: Buffer): number => {
  let ret = 0
  for (let i = 0; i < 16; i++) ret ^= c[i]
  return ret
}

export const memecryptoPrepareKey = (inp: Buffer, out: Buffer): void => {
  for (let i = 0; i < 0xB0; i++) out[i] = dexor16(inp.subarray(0x10 * i, 0x10 * (i + 1)))
}

export const memecryptoDecrypt = (key: Buffer, data: Buffer): void => {
  const plaintext = Buffer.alloc(16)
  mhy128Enc(data, key, plaintext)
  plaintext.copy(data)
}

export const memecryptoEncrypt = (key: Buffer, data: Buffer): void => {
  const ciphertext = Buffer.alloc(16)
  mhy128Dec(data, key, ciphertext)
  ciphertext.copy(data)
}