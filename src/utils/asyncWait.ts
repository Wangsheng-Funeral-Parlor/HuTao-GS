import { hrtime } from 'process'

type WaitCondition = (...any: any[]) => boolean

const taskList: {
  cond: WaitCondition | number
  resolve: () => void
  time?: number
}[] = []

setInterval(() => {
  let i = 0
  while (i < taskList.length) {
    try {
      const { cond, resolve, time } = taskList[i++]

      if (typeof cond === 'number' && Date.now() - time < cond) continue
      if (typeof cond === 'function' && !cond()) continue

      // Remove and resolve task
      taskList.splice(--i, 1)
      resolve()
    } catch (err) {
      console.log(err)
    }
  }
}, 20)

const { bigint: getTimeNs } = hrtime

export class WaitOnBlock {
  timestamp: bigint
  maxNs: bigint

  constructor(maxMs: number) {
    this.timestamp = getTimeNs()
    this.maxNs = BigInt(maxMs) * 1000000n
  }

  private checkIsBlocking(): boolean {
    const { timestamp, maxNs } = this
    return (getTimeNs() - timestamp >= maxNs)
  }

  async waitTick() {
    if (!this.checkIsBlocking()) return
    await waitTick()
    this.timestamp = getTimeNs()
  }

  async waitMs(ms: number) {
    if (!this.checkIsBlocking()) return
    await waitMs(ms)
    this.timestamp = getTimeNs()
  }

  async waitUntil(cond: WaitCondition) {
    if (!this.checkIsBlocking()) return
    await waitUntil(cond)
    this.timestamp = getTimeNs()
  }
}

export const waitTick = (): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond: 20, resolve, time: Date.now() }))
}

export const waitMs = (ms: number): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond: ms, resolve, time: Date.now() }))
}

export const waitUntil = (cond: WaitCondition): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond, resolve }))
}