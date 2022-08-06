export const xor = (data: Buffer, key: Buffer): void => {
  for (let i = 0; i < data.length; i++) {
    data.writeUInt8(data.readUInt8(i) ^ key.readUInt8(i % key.length), i)
  }
}

export const stringXorDecode = (encoded: Buffer, key: number): string => {
  const decoded = Buffer.alloc(encoded.length)

  let char = encoded[encoded.length - 1] ^ key
  for (let i = encoded.length - 1; i >= 0; i--) {
    char = encoded[i] ^ char
    decoded[i] = char
  }

  return decoded.toString()
}