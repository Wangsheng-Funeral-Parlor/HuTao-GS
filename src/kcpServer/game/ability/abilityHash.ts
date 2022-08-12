export default function abilityHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((str.charCodeAt(i) + 131 * hash) & 0xFFFFFFFF) >>> 0
  }
  return hash
}