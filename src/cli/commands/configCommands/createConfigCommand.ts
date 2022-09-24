import { DEFAULT_CONFIG } from '@/config'
import { getJson, setJson } from '@/utils/json'
import { CommandDefinition } from '..'

const createConfigCommand: CommandDefinition = {
  name: 'createConfig',
  desc: 'Create new config with default values if it doesn\'t exist',
  usage: [
    'createConfig <name> - Create new config',
    'createConfig        - Same but name is set to "default"'
  ],
  args: [
    { name: 'name', type: 'str', optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli

    const configName = args[0] || 'default'
    const allConfigs = getJson('config.json', {})

    if (configName === 'current') return printError('Invalid name:', configName)
    if (allConfigs[configName] != null) return printError('Config already exists:', configName)

    print('Creating config:', configName)

    allConfigs[configName] = DEFAULT_CONFIG
    setJson('config.json', allConfigs)

    print('Created config')
  }
}

export default createConfigCommand