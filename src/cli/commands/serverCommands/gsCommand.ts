import { DEFAULT_GSTATE } from '@/globalState'
import { CommandDefinition } from '..'

const gsCommand: CommandDefinition = {
  name: 'gs',
  desc: 'Set/Toggle/List global state',
  usage: [
    'gs set <name> <value> - Set global state to value',
    'gs toggle <name>      - Toggle global state',
    'gs list               - List global state'
  ],
  args: [
    { name: 'mode', type: 'str', values: ['set', 'toggle', 'list'] },
    { name: 'name', type: 'str', values: Object.keys(DEFAULT_GSTATE), optional: true },
    { name: 'value', type: 'str', values: ['true', 'false'], optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, server } = cmdInfo
    const { printError } = cli

    const [mode, name, value] = args
    switch (mode) {
      case 'set':
        if (!server.globalState.set(name, value === 'true')) printError('Unknown gstate:', name)
        break
      case 'toggle':
        if (!server.globalState.toggle(name)) printError('Unknown gstate:', name)
        break
      case 'list':
        server.globalState.printAll()
        break
      default:
        printError('Unknown mode:', mode)
    }
  }
}

export default gsCommand