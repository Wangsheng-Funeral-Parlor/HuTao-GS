import CLI from '@/cli'
import { registerBuiltInCommands } from '@/cli/commands'
import Logger from '@/logger'
import printIcon from '@/printIcon'
import Server from '@/server'
import { getTTY } from '@/tty'
import parseArgs, { ParsedArgs } from '@/utils/parseArgs'
import { appendFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

;(async (args: ParsedArgs) => {
  // initialize tty
  getTTY().setIO()

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
    // register commands
    registerBuiltInCommands()

    // start server
    server.start()
    cli.start()

    // check for update
    server.update?.checkForUpdate()
  }
})(parseArgs(process.argv))