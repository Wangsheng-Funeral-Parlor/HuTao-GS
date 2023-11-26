const n = (n: number | string) => BigInt(n)

const XXH3_kSecret = Buffer.from('b8fe6c3923a44bbe7c01812cf721ad1cded46de9839097db7240a4a4b7b3671fcb79e64eccc0e578825ad07dccff7221b8084674f743248ee03590e6813a264c3c2852bb91c300cb88d0658b1b532ea371644897a20df94e3819ef46a9deacd8a8fa763fe39c343ff9dcbbc7c70b4f1d8a51e04bcdb45931c89f7ec9d9787364eac5ac8334d3ebc3c581a0fffa1363eb170ddd51b7f0da49d316552629d4689e2b16be587d47a1fc8ff8b8d17ad031ce45cb3a8f95160428afd7fbcabb4b407e', 'hex')

const XXH_PRIME32_1 = n('0x9E3779B1')  /*!< 0b10011110001101110111100110110001 */
const XXH_PRIME32_2 = n('0x85EBCA77')  /*!< 0b10000101111010111100101001110111 */
const XXH_PRIME32_3 = n('0xC2B2AE3D')  /*!< 0b11000010101100101010111000111101 */
const XXH_PRIME32_4 = n('0x27D4EB2F')  /*!< 0b00100111110101001110101100101111 */
const XXH_PRIME32_5 = n('0x165667B1')  /*!< 0b00010110010101100110011110110001 */

const XXH_PRIME64_1 = n('0x9E3779B185EBCA87')  /*!< 0b1001111000110111011110011011000110000101111010111100101010000111 */
const XXH_PRIME64_2 = n('0xC2B2AE3D27D4EB4F')  /*!< 0b1100001010110010101011100011110100100111110101001110101101001111 */
const XXH_PRIME64_3 = n('0x165667B19E3779F9')  /*!< 0b0001011001010110011001111011000110011110001101110111100111111001 */
const XXH_PRIME64_4 = n('0x85EBCA77C2B2AE63')  /*!< 0b1000010111101011110010100111011111000010101100101010111001100011 */
const XXH_PRIME64_5 = n('0x27D4EB2F165667C5')  /*!< 0b0010011111010100111010110010111100010110010101100110011111000101 */

const PRIME_MX1 = n('0x165667919E3779F9') /*!< 0b0001011001010110011001111001000110011110001101110111100111111001 */
const PRIME_MX2 = n('0x9FB21C651E98DF25') /*!< 0b1001111110110010000111000110010100011110100110001101111100100101 */

const mask128 = (1n << 128n) - 1n
const mask64 = (1n << 64n) - 1n
const mask32 = (1n << 32n) - 1n
const _U64 = 8
const _U32 = 4

const XXH_STRIPE_LEN = 64
const XXH_SECRET_CONSUME_RATE = 8
const XXH_ACC_NB = (XXH_STRIPE_LEN / _U64)

const XXH3_SECRET_SIZE_MIN = 192
const XXH3_MIDSIZE_MAX = 240

const XXH3_INIT_ACC = [
  XXH_PRIME32_3, XXH_PRIME64_1, XXH_PRIME64_2, XXH_PRIME64_3,
  XXH_PRIME64_4, XXH_PRIME32_2, XXH_PRIME64_5, XXH_PRIME32_1
]

// Basically (byte*)buf + offset
function getView(buf: Buffer, offset: number = 0): Buffer {
  return buf.subarray(offset)
}

const XXH_mult32to64 = (lhs: bigint, rhs: bigint): bigint => ((lhs & mask32) * (rhs & mask32)) & mask64
const XXH_mult64to128 = (lhs: bigint, rhs: bigint): bigint => ((lhs & mask64) * (rhs & mask64)) & mask128
const XXH_rotl32 = (x: bigint, r: bigint): bigint => (((x) << (r)) | ((x) >> (32n - (r)))) & mask32
const XXH_rotl64 = (x: bigint, r: bigint): bigint => (((x) << (r)) | ((x) >> (64n - (r)))) & mask64
const XXH_swap32 = (x: bigint): bigint =>
  ((x << 24n) & 0xFF000000n) |
  ((x << 8n) & 0x00FF0000n) |
  ((x >> 8n) & 0x0000FF00n) |
  ((x >> 24n) & 0x000000FFn)
const XXH_swap64 = (x: bigint): bigint =>
  ((x << 56n) & 0xFF00000000000000n) |
  ((x << 40n) & 0x00FF000000000000n) |
  ((x << 24n) & 0x0000FF0000000000n) |
  ((x << 8n) & 0x000000FF00000000n) |
  ((x >> 8n) & 0x00000000FF000000n) |
  ((x >> 24n) & 0x0000000000FF0000n) |
  ((x >> 40n) & 0x000000000000FF00n) |
  ((x >> 56n) & 0x00000000000000FFn)

const assert = (a: boolean) => { if (!a) throw new Error('Assert failed') }

function XXH64_avalanche(hash: bigint): bigint {
  hash ^= (hash & mask64) >> 33n
  hash *= XXH_PRIME64_2
  hash ^= (hash & mask64) >> 29n
  hash *= XXH_PRIME64_3
  hash ^= (hash & mask64) >> 32n
  return hash & mask64
}

function XXH3_scalarRound(acc: BigUint64Array, input: Buffer, secret: Buffer, lane: number): void {
  assert(lane < XXH_ACC_NB)

  const dataVal = input.readBigUInt64LE(lane * _U64)
  const dataKey = dataVal ^ secret.readBigUInt64LE(lane * _U64)

  acc[lane ^ 1] += dataVal
  acc[lane] = (XXH_mult32to64(dataKey, dataKey >> 32n) + acc[lane]) & mask64
}

function XXH3_accumulate_512_scalar(acc: BigUint64Array, input: Buffer, secret: Buffer): void {
  for (let i = 0; i < XXH_ACC_NB; i++) {
    XXH3_scalarRound(acc, input, secret, i)
  }
}

function XXH3_accumulate(acc: BigUint64Array, input: Buffer, secret: Buffer, nbStripes: number): void {
  for (let n = 0; n < nbStripes; n++) {
    XXH3_accumulate_512_scalar(acc, getView(input, n * XXH_STRIPE_LEN), getView(secret, n * _U64))
  }
}

function XXH3_scalarScrambleRound(acc: BigUint64Array, secret: Buffer, lane: number) {
  assert(lane < XXH_ACC_NB)

  const key64 = secret.readBigUInt64LE(lane * _U64)

  let acc64 = acc[lane]

  acc64 = XXH_xorshift64(acc64, 47n)
  acc64 ^= key64
  acc64 *= XXH_PRIME32_1

  acc[lane] = acc64 & mask64
}

function XXH3_scrambleAcc_scalar(acc: BigUint64Array, secret: Buffer): void {
  for (let i = 0; i < XXH_ACC_NB; i++) {
    XXH3_scalarScrambleRound(acc, secret, i)
  }
}

function XXH3_mix2Accs(acc: Buffer, secret: Buffer): bigint {
  return XXH3_mul128_fold64(acc.readBigUInt64LE(0) ^ secret.readBigUInt64LE(0), acc.readBigUInt64LE(_U64) ^ secret.readBigUInt64LE(_U64))
}

function XXH3_mergeAccs(acc: Buffer, secret: Buffer, start: bigint): bigint {
  let result64 = start & mask64

  result64 += XXH3_mix2Accs(getView(acc, 0 * _U64), getView(secret, 0 * _U64))
  result64 += XXH3_mix2Accs(getView(acc, 2 * _U64), getView(secret, 2 * _U64))
  result64 += XXH3_mix2Accs(getView(acc, 4 * _U64), getView(secret, 4 * _U64))
  result64 += XXH3_mix2Accs(getView(acc, 6 * _U64), getView(secret, 6 * _U64))

  return XXH3_avalanche(result64)
}

function XXH3_hashLong_internal_loop(acc: BigUint64Array, input: Buffer, secret: Buffer): void {
  const len = input.length
  const nbStripesPerBlock = (secret.length - XXH_STRIPE_LEN) / XXH_SECRET_CONSUME_RATE
  const block_len = XXH_STRIPE_LEN * nbStripesPerBlock
  const nb_blocks = Math.floor((len - 1) / block_len)

  assert(secret.length >= XXH3_SECRET_SIZE_MIN)

  for (let n = 0; n < nb_blocks; n++) {
    XXH3_accumulate(acc, getView(input, n * block_len), secret, nbStripesPerBlock)
    XXH3_scrambleAcc_scalar(acc, getView(secret, secret.length - XXH_STRIPE_LEN))
  }

  /* last partial block */
  assert(len > XXH_STRIPE_LEN)

  const nbStripes = Math.floor(((len - 1) - (block_len * nb_blocks)) / XXH_STRIPE_LEN)
  assert(nbStripes < (secret.length / XXH_SECRET_CONSUME_RATE))
  XXH3_accumulate(acc, getView(input, nb_blocks * block_len), secret, nbStripes)

  /* last stripe */
  const p = getView(input, len - XXH_STRIPE_LEN)
  XXH3_accumulate_512_scalar(acc, p, getView(secret, secret.length - XXH_STRIPE_LEN - 7))
}

function XXH3_hashLong_64b(input: Buffer, secret: Buffer): bigint {
  const len = input.length
  const acc = new BigUint64Array([...XXH3_INIT_ACC])
  assert(len > 128)

  XXH3_hashLong_internal_loop(acc, input, secret)

  const accbuf = Buffer.from(acc.buffer)

  /* converge into final hash */
  assert(accbuf.length === 64)
  assert(secret.length >= accbuf.length + 11)

  return XXH3_mergeAccs(accbuf, getView(secret, 11), n(len) * XXH_PRIME64_1)
}

function XXH3_mul128_fold64(lhs: bigint, rhs: bigint): bigint {
  const product = XXH_mult64to128(lhs, rhs)
  return (product ^ (product >> 64n)) & mask64
}

function XXH_xorshift64(v64: bigint, shift: bigint): bigint {
  assert(0n <= shift && shift < 64n)
  return (v64 ^ ((v64 & mask64) >> shift)) & mask64
}

function XXH3_avalanche(h64: bigint) {
  h64 = XXH_xorshift64(h64, 37n)
  h64 *= PRIME_MX1
  h64 = XXH_xorshift64(h64, 32n)
  return h64 & mask64
}

function XXH3_rrmxmx(h64: bigint, len: bigint) {
  /* this mix is inspired by Pelle Evensen's rrmxmx */
  h64 ^= XXH_rotl64(h64, 49n) ^ XXH_rotl64(h64, 24n)
  h64 *= PRIME_MX2
  h64 ^= ((h64 & mask64) >> 35n) + len
  h64 *= PRIME_MX2
  return XXH_xorshift64(h64 & mask64, 28n)
}

function XXH3_len_1to3_64b(input: Buffer, secret: Buffer, seed: bigint) {
  const len = input.length
  assert(len > 0 && len <= 3)

  /*
   * len = 1: combined = { input[0], 0x01, input[0], input[0] }
   * len = 2: combined = { input[1], 0x02, input[0], input[1] }
   * len = 3: combined = { input[2], 0x03, input[0], input[1] }
   */
  const c1 = input[0]
  const c2 = input[len >> 1]
  const c3 = input[len - 1]
  const combined = n((c1 << 16) | (c2 << 24) | (c3 << 0) | (len << 8))
  const bitflip = n(secret.readUInt32LE()) ^ n(secret.readUInt32LE(4)) + seed
  const keyed = combined ^ bitflip

  return XXH64_avalanche(keyed)
}

function XXH3_len_4to8_64b(input: Buffer, secret: Buffer, seed: bigint) {
  const len = input.length
  assert(len >= 4 && len <= 8)

  seed ^= XXH_swap32(seed & mask32) << 32n

  const input1 = n(input.readUInt32LE())
  const input2 = n(input.readUInt32LE(len - 4))
  const bitflip = (secret.readBigUInt64LE(1 * _U64) ^ secret.readBigUInt64LE(2 * _U64)) - seed
  const input64 = input2 + (input1 << 32n)
  const keyed = input64 ^ bitflip

  return XXH3_rrmxmx(keyed, n(len))
}

function XXH3_len_9to16_64b(input: Buffer, secret: Buffer, seed: bigint) {
  const len = input.length
  assert(len >= 9 && len <= 16)

  const bitflip1 = (secret.readBigUInt64LE(3 * _U64) ^ secret.readBigUInt64LE(4 * _U64)) + seed
  const bitflip2 = (secret.readBigUInt64LE(5 * _U64) ^ secret.readBigUInt64LE(6 * _U64)) - seed
  const input_lo = input.readBigUInt64LE() ^ bitflip1
  const input_hi = input.readBigUInt64LE(len - 8) ^ bitflip2
  const acc = n(len) + XXH_swap64(input_lo) + input_hi + XXH3_mul128_fold64(input_lo, input_hi)

  return XXH3_avalanche(acc)
}

function XXH3_len_0to16_64b(input: Buffer, secret: Buffer, seed: bigint) {
  const len = input.length
  assert(len <= 16)

  if (len > 8) return XXH3_len_9to16_64b(input, secret, seed)
  if (len >= 4) return XXH3_len_4to8_64b(input, secret, seed)
  if (len > 0) return XXH3_len_1to3_64b(input, secret, seed)

  return XXH64_avalanche(seed ^ (secret.readBigUInt64LE(7 * _U64) ^ secret.readBigUInt64LE(8 * _U64)))
}

function XXH3_mix16B(input: Buffer, secret: Buffer, seed: bigint): bigint {
  const input_lo = input.readBigUInt64LE()
  const input_hi = input.readBigUInt64LE(8)
  return XXH3_mul128_fold64(
    input_lo ^ (secret.readBigUInt64LE() + seed),
    input_hi ^ (secret.readBigUInt64LE(8) - seed)
  )
}

function XXH3_len_17to128_64b(input: Buffer, secret: Buffer, seed: bigint): bigint {
  const len = input.length

  assert(secret.length >= XXH3_SECRET_SIZE_MIN)
  assert(16 < len && len <= 128)

  let acc = n(len) * XXH_PRIME64_1

  if (len > 32) {
    if (len > 64) {
      if (len > 96) {
        acc += XXH3_mix16B(getView(input, 48), getView(secret, 12 * _U64), seed)
        acc += XXH3_mix16B(getView(input, len - 64), getView(secret, 14 * _U64), seed)
      }
      acc += XXH3_mix16B(getView(input, 32), getView(secret, 8 * _U64), seed)
      acc += XXH3_mix16B(getView(input, len - 48), getView(secret, 10 * _U64), seed)
    }
    acc += XXH3_mix16B(getView(input, 16), getView(secret, 4 * _U64), seed)
    acc += XXH3_mix16B(getView(input, len - 32), getView(secret, 6 * _U64), seed)
  }
  acc += XXH3_mix16B(getView(input, 0), getView(secret, 0), seed)
  acc += XXH3_mix16B(getView(input, len - 16), getView(secret, 2 * _U64), seed)

  return XXH3_avalanche(acc)
}

function XXH3_len_129to240_64b(input: Buffer, secret: Buffer, seed: bigint): bigint {
  const len = input.length

  assert(secret.length >= XXH3_SECRET_SIZE_MIN)
  assert(128 < len && len <= XXH3_MIDSIZE_MAX)

  let acc = n(len) * XXH_PRIME64_1

  const nbRounds = len / 16

  assert(128 < len && len <= XXH3_MIDSIZE_MAX)
  for (let i = 0; i < 8; i++) {
    acc += XXH3_mix16B(getView(input, (16 * i)), getView(secret, (16 * i)), seed)
  }
  /* last bytes */
  let acc_end = XXH3_mix16B(getView(input, len - 16), getView(secret, XXH3_SECRET_SIZE_MIN - 17), seed)
  assert(nbRounds >= 8)
  acc = XXH3_avalanche(acc)

  for (let i = 8; i < nbRounds; i++) {
    acc_end += XXH3_mix16B(getView(input, (16 * i)), getView(secret, (16 * (i - 8)) + 3), seed)
  }

  return XXH3_avalanche(acc + acc_end)
}

export function XXH3_64bits(input: Buffer, secret = XXH3_kSecret, seed = 0n): bigint {
  assert(secret.length >= XXH3_SECRET_SIZE_MIN)

  const len = input.length

  if (len <= 16) return XXH3_len_0to16_64b(input, secret, seed)
  if (len <= 128) return XXH3_len_17to128_64b(input, secret, seed)
  if (len <= XXH3_MIDSIZE_MAX) return XXH3_len_129to240_64b(input, secret, seed)

  try {
    return XXH3_hashLong_64b(input, secret)
  } catch (err) {
    console.log(err)
    return 0n
  }
}