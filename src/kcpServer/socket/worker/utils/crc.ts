interface Table {
  [i: number]: number
}

function signedCrcTable(): Table {
  let c = 0
  const table = new Array(256)

  for (let n = 0; n < 256; ++n) {
    c = n
    for (let i = 0; i < 8; i++) {
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
    }
    table[n] = c
  }

  return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table
}

export const T0 = signedCrcTable()

function sliceBy16Tables(T: Table) {
  let c = 0
  let v = 0
  const table = typeof Int32Array !== 'undefined' ? new Int32Array(4096) : new Array(4096)

  for (let n = 0; n < 256; ++n) table[n] = T[n]
  for (let n = 0; n < 256; ++n) {
    v = T[n]
    for (c = 256 + n; c < 4096; c += 256) v = table[c] = (v >>> 8) ^ T[v & 0xFF]
  }

  const out = []
  for (let n = 1; n < 16; ++n) {
    out[n - 1] = table instanceof Array ? table.slice(n * 256, n * 256 + 256) : table.subarray(n * 256, n * 256 + 256)
  }

  return out
}

const TT = sliceBy16Tables(T0)
const [
  T1, T2, T3, T4, T5,
  T6, T7, T8, T9, Ta,
  Tb, Tc, Td, Te, Tf
] = TT

function crc32Fast(B: Buffer, C: number, L: number, i: number = 0) {
  while (i < L) {
    C =
      Tf[B[i++] ^ (C & 255)] ^
      Te[B[i++] ^ ((C >> 8) & 255)] ^
      Td[B[i++] ^ ((C >> 16) & 255)] ^
      Tc[B[i++] ^ (C >>> 24)] ^
      Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
      T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
      T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]]
  }

  return { C, L, i }
}

export function crc32(B: Buffer, seed: number = 0): number {
  let C = seed ^ -1
  let L = B.length
  let i = 0

  if (L > 15) {
    L -= 15; ({ C, L, i } = crc32Fast(B, C, L, i)); L += 15
  }

  while (i < L) {
    C = (C >>> 8) ^ T0[(C ^ B[i++]) & 0xFF]
  }

  return ~C
}