import Worker from '#/socket/worker'
import { appendFileSync } from 'fs'
import { join } from 'path'
import { argv, cwd } from 'process'
import parseArgs from './utils/parseArgs'

(async () => {
  const args = parseArgs(argv)
  if (args.lm != null) {
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
    return
  }

  const Logger = (await import('@/logger')).default
  const Server = (await import('@/server')).default
  const CLI = (await import('./cli')).default
  const printIcon = (await import('./printIcon')).default
  const getTTY = (await import('./tty')).default

  // initialize tty
  getTTY()

  // print icon to terminal
  printIcon()

  const server = new Server()
  const logger = new Logger()
  const cli = new CLI(server)

  let hasError = false

  // restart on error
  process.on('uncaughtException', (err) => {
    if (hasError) return
    hasError = true

    try {
      appendFileSync(join(cwd(), 'data/log/server/uncaught.txt'), `${err.stack || err.message}\n`)
    } catch (e) { }

    logger.fatal('Uncaught exception:', err)
    server.restart(5e3)
  })

  logger.debug('Launch arguments:', process.argv)

  if (args.updateState != null) {
    // start update
    server.update?.start()
  } else {
    // start server
    server.start()
    cli.start()

    // check for update
    server.update?.checkForUpdate()
  }
})()