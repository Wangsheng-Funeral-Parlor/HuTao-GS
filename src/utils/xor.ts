export const xor = (data: Buffer, key: Buffer): void => {
  for (let i = 0; i < data.length; i++) {
    data.writeUInt8(data.readUInt8(i) ^ key.readUInt8(i % key.length), i)
  }
}

export const stringXorEncode = (str: string | Buffer, rand: number): Buffer => {
  const input = Buffer.from(str)
  const len = input.length

  const encoded = Buffer.alloc(len)
  for (let i = 0; i < len; i++) {
    encoded[i] = input[i] ^ (i < (len - 1) ? input[i + 1] : rand)
  }

  return encoded
}

export const stringXorDecode = (encoded: Buffer, key: number, buf: boolean = false): string | Buffer => {
  const len = encoded.length
  const decoded = Buffer.alloc(len)

  let byte = encoded[len - 1] ^ key
  for (let i = len - 1; i >= 0; i--) {
    byte = encoded[i] ^ byte
    decoded[i] = byte
  }

  return buf ? decoded : decoded.toString()
}