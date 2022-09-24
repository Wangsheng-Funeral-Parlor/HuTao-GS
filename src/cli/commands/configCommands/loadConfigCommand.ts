import CLI from '@/cli'
import Server from '@/server'
import { getJson, setJson } from '@/utils/json'
import { CommandDefinition } from '..'

const loadConfigCommand: CommandDefinition = {
  name: 'loadConfig',
  desc: 'Change current config',
  usage: [
    'loadConfig <name> - Change current config & restart',
    'loadConfig        - Same but name is set to "default"'
  ],
  args: [
    { name: 'name', type: 'str', optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, server } = cmdInfo as { args: string[], cli: CLI, server: Server }
    const { print, printError } = cli

    const configName = args[0] || 'default'
    const allConfigs = getJson('config.json', {})

    if (configName === 'current') return printError('Invalid name:', configName)
    if (allConfigs[configName] == null) return printError('Config not found:', configName)

    print('Loading config:', configName)

    allConfigs.current = configName
    if (allConfigs.current === 'default') delete allConfigs.current

    setJson('config.json', allConfigs)

    cli.stop()
    await server.restart()
  }
}

export default loadConfigCommand