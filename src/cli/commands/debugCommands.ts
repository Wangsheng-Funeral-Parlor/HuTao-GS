import { CommandDefinition } from '.'

const debugCommands: CommandDefinition[] = [
  {
    name: 'logLevel',
    desc: 'Set log level [0]N-F-E-W-I-D-P-V-V[8]',
    args: [
      { name: 'level', type: 'int' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli, server } = cmdInfo
      const { print } = cli
      const level: number = args[0]

      if (level < 0 || level > 7) {
        print('Invalid log level:', level)
        return
      }

      server.setLogLevel(level)
    }
  },
  {
    name: 'log',
    desc: 'Enable/Disable save server log',
    exec: async (cmdInfo) => cmdInfo.server.globalState.toggle('SaveLog')
  },
  {
    name: 'saveRecorder',
    desc: 'Enable/Disable save log recorder (overseauspider)',
    exec: async (cmdInfo) => cmdInfo.server.globalState.toggle('SaveRecorder')
  },
  {
    name: 'saveReport',
    desc: 'Enable/Disable save report (log-upload-os)',
    exec: async (cmdInfo) => cmdInfo.server.globalState.toggle('SaveReport')
  },
  {
    name: 'packetId',
    desc: 'Show/Hide packetId',
    exec: async (cmdInfo) => cmdInfo.server.globalState.toggle('ShowPacketId')
  },
  {
    name: 'protoMatch',
    desc: 'Enable/Disable protoMatch',
    exec: async (cmdInfo) => cmdInfo.server.globalState.toggle('UseProtoMatch')
  }
]

export default debugCommands