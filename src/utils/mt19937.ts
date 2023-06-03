const NN = 312
const MM = 156
const MATRIX_A = 0xb5026f5aa96619e9n
const UM = 0xffffffff80000000n // Most significant 33 bits
const LM = 0x7fffffffn // Least significant 31 bits

export default class MT19937 {
  mt: bigint[]
  mti: number

  constructor() {
    this.mt = new Array(NN).fill(0n)
    this.mti = NN + 1
  }

  seed(seed: bigint): void {
    const { mt } = this

    mt[0] = seed & 0xffffffffffffffffn

    for (let i = 1; i < NN; i++) {
      mt[i] = (6364136223846793005n * (mt[i - 1] ^ (mt[i - 1] >> 62n)) + BigInt(i)) & 0xffffffffffffffffn
    }

    this.mti = NN
  }

  // generate NN words at one time
  generateWords() {
    const { mt, mti } = this
    let x: bigint

    if (mti < NN) return

    // if seed() has not been called, a default initial seed is used
    if (mti == NN + 1) this.seed(5489n)

    for (let k = 0; k < NN - 1; k++) {
      x = (mt[k] & UM) | (mt[k + 1] & LM)

      if (k < NN - MM) {
        mt[k] = mt[k + MM] ^ (x >> 1n) ^ ((x & 1n) == 0n ? 0n : MATRIX_A)
      } else {
        mt[k] = mt[k + (MM - NN)] ^ (x >> 1n) ^ ((x & 1n) == 0n ? 0n : MATRIX_A)
      }
    }

    x = (mt[NN - 1] & UM) | (mt[0] & LM)
    mt[NN - 1] = mt[MM - 1] ^ (x >> 1n) ^ ((x & 1n) == 0n ? 0n : MATRIX_A)

    this.mti = 0
  }

  // generates a random number on [0, 2^64-1]-interval
  int64(): bigint {
    this.generateWords()

    let x = this.mt[this.mti++]

    x ^= (x >> 29n) & 0x5555555555555555n
    x ^= (x << 17n) & 0x71d67fffeda60000n
    x ^= (x << 37n) & 0xfff7eee000000000n
    x ^= x >> 43n

    return x
  }

  // generates a random number on [0,1]-real-interval
  int64Real1(): number {
    return parseInt((this.int64() >> 11n).toString()) * (1.0 / 9007199254740991.0)
  }

  // generates a random number on [0,1)-real-interval
  int64Real2(): number {
    return parseInt((this.int64() >> 11n).toString()) * (1.0 / 9007199254740992.0)
  }

  // generates a random number on (0,1)-real-interval
  int64Real3(): number {
    return (parseInt((this.int64() >> 12n).toString()) + 0.5) * (1.0 / 4503599627370496.0)
  }
}
