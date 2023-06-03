import md5 from "md5"

export default function hash(data: string): string {
  const md5hash = md5(data)
    .split("")
    .map((h: string) => parseInt(h, 16))
  const outHash = []
  const offset = md5hash[0]
  const len = md5hash.length

  for (let i = 0; i < len; i++) {
    outHash[i] = md5hash[(offset + i) % len]
    outHash[i] += md5hash[(offset + i + 1) % len]
    outHash[i] += md5hash[(offset + i + 2) % len]
    outHash[i] += md5hash[(offset + i + 3) % len]
    outHash[i] %= 10
  }

  return outHash.join("").padStart(len, "0")
}

export function getStringHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((str.charCodeAt(i) + 131 * hash) & 0xffffffff) >>> 0
  }
  return hash
}
