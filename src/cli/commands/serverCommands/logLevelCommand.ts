import { LogLevel } from '@/logger'
import { CommandDefinition } from '..'

const logLevels = Object.values(LogLevel).map(v => parseInt(v.toString())).filter(v => !isNaN(v))

const logLevelCommand: CommandDefinition = {
  name: 'logLevel',
  desc: 'Set log level',
  usage: logLevels.map(level => `logLevel ${level} - Set log level to ${LogLevel[level]}`),
  args: [
    { name: 'level', type: 'int', values: logLevels }
  ],
  exec: async (cmdInfo) => {
    const { args, server } = cmdInfo
    server.setLogLevel(args[0])
  }
}

export default logLevelCommand