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

export const waitTick = (): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond: 20, resolve, time: Date.now() }))
}

export const waitMs = (ms: number): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond: ms, resolve, time: Date.now() }))
}

export const waitUntil = (cond: WaitCondition): Promise<void> => {
  return new Promise(resolve => taskList.push({ cond, resolve }))
}