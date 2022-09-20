import Worker from '#/socket/worker'
import { ParsedArgs } from '@/utils/parseArgs'

export default async (args: ParsedArgs) => {
  let worker: typeof Worker

  switch (args.lm) {
    case 'kcp':
      worker = (await import('#/socket/worker/kcpWorker')).default
      break
    case 'recv':
      worker = (await import('#/socket/worker/recvWorker')).default
      break
    default:
      return
  }

  worker.create()
}