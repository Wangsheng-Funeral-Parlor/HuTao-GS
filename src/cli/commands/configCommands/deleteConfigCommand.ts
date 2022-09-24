import { getJson, setJson } from '@/utils/json'
import { CommandDefinition } from '..'

const deleteConfigCommand: CommandDefinition = {
  name: 'deleteConfig',
  desc: 'Delete config if it exists',
  usage: [
    'deleteConfig <name> - Delete config',
    'deleteConfig        - Same but name is set to "default"'
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
    if (allConfigs[configName] == null) return printError('Config not found:', configName)

    print('Deleting config:', configName)

    delete allConfigs[configName]
    setJson('config.json', allConfigs)

    print('Deleted config.')
  }
}

export default deleteConfigCommand