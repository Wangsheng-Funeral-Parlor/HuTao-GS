export default function newGuid() {
  const rndA = BigInt(Math.floor(Math.random() * 0x1000000))
  const rndB = BigInt(Math.floor(Math.random() * 0x1000000))
  return BigInt((((0x30n << 24n) | rndA) << 32n) | rndB)
}