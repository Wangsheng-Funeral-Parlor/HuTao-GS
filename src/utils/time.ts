export function getTimeSeconds(d?: Date | number): number {
  if (d instanceof Date) d = d.getTime()
  else if (d == null) d = Date.now()

  return Math.floor(d / 1e3)
}

export function getTimestamp(t: number = Date.now()): string {
  const d = new Date(t)
  const Y = d.getFullYear().toString().padStart(4, "0")
  const M = (d.getMonth() + 1).toString().padStart(2, "0")
  const D = d.getDate().toString().padStart(2, "0")
  const h = d.getHours().toString().padStart(2, "0")
  const m = d.getMinutes().toString().padStart(2, "0")
  const s = d.getSeconds().toString().padStart(2, "0")

  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}
