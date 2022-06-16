import Server from '@/server'
import Logger from '@/logger'
import printIcon from './printIcon'
import getTTY from './tty'
import CLI from './cli'
import { appendFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

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

// start server
server.start()

// start cli
cli.start()