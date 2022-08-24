import { DEFAULT_CONFIG } from '@/config'
import Server from '@/server'
import { getJson, setJson } from '@/utils/json'
import { CommandDefinition } from '.'
import CLI from '..'

const configCommands: CommandDefinition[] = [
  {
    name: 'loadConfig',
    desc: 'Change current config & restart',
    args: [
      { name: 'name', type: 'str', optional: true }
    ],
    exec: async (cmdInfo) => {
      const { cli, server, args } = cmdInfo as { cli: CLI, server: Server, args: string[] }
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
    },
  },
  {
    name: 'createConfig',
    desc: 'Create config with default values',
    args: [
      { name: 'name', type: 'str', optional: true }
    ],
    exec: async (cmdInfo) => {
      const { cli, args } = cmdInfo
      const { print, printError } = cli

      const configName = args[0] || 'default'
      const allConfigs = getJson('config.json', {})

      if (configName === 'current') return printError('Invalid name:', configName)
      if (allConfigs[configName] != null) return printError('Config already exists:', configName)

      print('Creating config:', configName)

      allConfigs[configName] = DEFAULT_CONFIG
      setJson('config.json', allConfigs)

      print('Complete.')
    }
  },
  {
    name: 'deleteConfig',
    desc: 'Delete config',
    args: [
      { name: 'name', type: 'str', optional: true }
    ],
    exec: async (cmdInfo) => {
      const { cli, args } = cmdInfo
      const { print, printError } = cli

      const configName = args[0] || 'default'
      const allConfigs = getJson('config.json', {})

      if (configName === 'current') return printError('Invalid name:', configName)
      if (allConfigs[configName] == null) return printError('Config not found:', configName)

      print('Deleting config:', configName)

      delete allConfigs[configName]
      setJson('config.json', allConfigs)

      print('Complete.')
    }
  }
]

export default configCommands