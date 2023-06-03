const shiftRowsTable = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11]
const shiftRowsTableInv = [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3]
const lookupSbox = [...generateSbox(283)]
const lookupSboxInv = [...inverseSbox(lookupSbox)]
const lookupG2 = [...generateGMul(2)]
const lookupG3 = [...generateGMul(3)]
const lookupG9 = [...generateGMul(9)]
const lookupG11 = [...generateGMul(11)]
const lookupG13 = [...generateGMul(13)]
const lookupG14 = [...generateGMul(14)]

export function generateSbox(p: number): Buffer {
  // Calculate Multiplicative Inverse
  const t = Buffer.alloc(256)
  for (let i = 0, x = 1; i < 256; i++) {
    t[i] = x
    x ^= (x << 1) ^ ((x >>> 7) * p)
  }

  // Generate Sbox with Affine transformation
  const sbox = Buffer.alloc(256)
  sbox[0] = 0x63
  for (let i = 0; i < 255; i++) {
    let x = t[255 - i]
    x |= x << 8
    x ^= (x >> 4) ^ (x >> 5) ^ (x >> 6) ^ (x >> 7)
    sbox[t[i]] = (x ^ 0x63) & 0xff
  }

  return sbox
}

// Inverse of Sbox
export function inverseSbox(sbox: number[]): Buffer {
  const invSbox = Buffer.alloc(256)
  for (let i = 0; i < 256; i++) {
    invSbox[i] = sbox.indexOf(i)
  }

  return invSbox
}

export function generateGMul(mul: number): Buffer {
  const gmul = Buffer.alloc(256)
  for (let i = 0; i < 256; i++) {
    let a = mul
    let b = i
    let p = 0

    for (let j = 0; j < 8; j++) {
      if ((b & 1) != 0) p ^= a
      const hi = (a & 0x80) != 0
      a <<= 1
      if (hi) a ^= 0x1b
      b >>= 1
    }

    gmul[i] = p
  }

  return gmul
}

// Xor's all elements in a n byte array a by b
export function xorr(a: Buffer, b: Buffer, offset: number, n: number): void {
  for (let i = 0; i < n; i++) a[i] ^= b[(i + offset) % b.length]
}

// Xor the current cipher state by a specific round key
export function xorRoundKey(state: Buffer, keys: Buffer, round: number): void {
  xorr(state, keys, round * 16, 16)
}

// Apply the rijndael s-box to all elements in an array
// http://en.wikipedia.org/wiki/Rijndael_S-box
export function subBytes(a: Buffer, n: number): void {
  for (let i = 0; i < n; i++) a[i] = lookupSbox[a[i]]
}
export function subBytesInv(a: Buffer, n: number): void {
  for (let i = 0; i < n; i++) a[i] = lookupSboxInv[a[i]]
}

// Apply the shift rows step on the 16 byte cipher state
// http://en.wikipedia.org/wiki/Advanced_Encryption_Standard#The_ShiftRows_step
export function shiftRows(state: Buffer): void {
  const temp = Buffer.alloc(16)
  state.copy(temp)
  for (let i = 0; i < 16; i++) state[i] = temp[shiftRowsTable[i]]
}
export function shiftRowsInv(state: Buffer): void {
  const temp = Buffer.alloc(16)
  state.copy(temp)
  for (let i = 0; i < 16; i++) state[i] = temp[shiftRowsTableInv[i]]
}

// Perform the mix columns matrix on one column of 4 bytes
// http://en.wikipedia.org/wiki/Rijndael_mix_columns
export function mixCol(state: Buffer, offset: number): void {
  const a0 = state[0 + offset]
  const a1 = state[1 + offset]
  const a2 = state[2 + offset]
  const a3 = state[3 + offset]
  state[0 + offset] = lookupG2[a0] ^ lookupG3[a1] ^ a2 ^ a3
  state[1 + offset] = lookupG2[a1] ^ lookupG3[a2] ^ a3 ^ a0
  state[2 + offset] = lookupG2[a2] ^ lookupG3[a3] ^ a0 ^ a1
  state[3 + offset] = lookupG2[a3] ^ lookupG3[a0] ^ a1 ^ a2
}

// Perform the mix columns matrix on each column of the 16 bytes
export function mixCols(state: Buffer): void {
  mixCol(state, 0)
  mixCol(state, 4)
  mixCol(state, 8)
  mixCol(state, 12)
}

// Perform the inverse mix columns matrix on one column of 4 bytes
// http://en.wikipedia.org/wiki/Rijndael_mix_columns
export function mixColInv(state: Buffer, offset: number): void {
  const a0 = state[0 + offset]
  const a1 = state[1 + offset]
  const a2 = state[2 + offset]
  const a3 = state[3 + offset]
  state[0 + offset] = lookupG14[a0] ^ lookupG9[a3] ^ lookupG13[a2] ^ lookupG11[a1]
  state[1 + offset] = lookupG14[a1] ^ lookupG9[a0] ^ lookupG13[a3] ^ lookupG11[a2]
  state[2 + offset] = lookupG14[a2] ^ lookupG9[a1] ^ lookupG13[a0] ^ lookupG11[a3]
  state[3 + offset] = lookupG14[a3] ^ lookupG9[a2] ^ lookupG13[a1] ^ lookupG11[a0]
}

// Perform the inverse mix columns matrix on each column of the 16 bytes
export function mixColsInv(state: Buffer): void {
  mixColInv(state, 0)
  mixColInv(state, 4)
  mixColInv(state, 8)
  mixColInv(state, 12)
}

// This is normal oqs_aes128_enc_c, however they are using inv tables instead
export function mhy128Enc(plaintext: Buffer, schedule: Buffer, ciphertext: Buffer): void {
  // First Round
  plaintext.copy(ciphertext)
  xorRoundKey(ciphertext, schedule, 0)

  // Middle rounds
  for (let i = 0; i < 9; i++) {
    subBytesInv(ciphertext, 16)
    shiftRowsInv(ciphertext)
    mixColsInv(ciphertext)
    xorRoundKey(ciphertext, schedule, i + 1)
  }

  // Final Round
  subBytesInv(ciphertext, 16)
  shiftRowsInv(ciphertext)
  xorRoundKey(ciphertext, schedule, 10)
}

// This is normal oqs_aes128_dec_c, however this time they are using non-inv tables
export function mhy128Dec(ciphertext: Buffer, schedule: Buffer, plaintext: Buffer): void {
  // Reverse the final Round
  ciphertext.copy(plaintext)
  xorRoundKey(plaintext, schedule, 10)
  shiftRows(plaintext)
  subBytes(plaintext, 16)

  // Reverse the middle rounds
  for (let i = 0; i < 9; i++) {
    xorRoundKey(plaintext, schedule, 9 - i)
    mixCols(plaintext)
    shiftRows(plaintext)
    subBytes(plaintext, 16)
  }

  // Reverse the first Round
  xorRoundKey(plaintext, schedule, 0)
}
