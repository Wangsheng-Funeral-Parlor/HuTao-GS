import { LogLevel } from '@/logger'
import translate from '@/translate'
import { CommandDefinition } from '..'

const logLevels = Object.values(LogLevel).map(v => parseInt(v.toString())).filter(v => !isNaN(v))

const logLevelCommand: CommandDefinition = {
  name: 'logLevel',
  usage: logLevels.map(level => translate('cli.commands.logLevel.usage', level, LogLevel[level])),
  args: [
    { name: 'level', type: 'int', values: logLevels }
  ],
  exec: async (cmdInfo) => {
    const { args, server } = cmdInfo
    server.setLogLevel(args[0])
  }
}

export default logLevelCommand