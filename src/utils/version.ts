export function versionStrToNum(verStr: string): number {
  return (verStr?.match(/[\d.]+/)?.[0] || '0')
    .split('.')
    .map((n, i, arr) => (parseInt(n) & 0xFF) << (8 * ((arr.length - 1) - i)))
    .reduce((sum, v) => sum + v, 0)
}