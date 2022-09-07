import { CommandDefinition } from '.'

const accountCommands: CommandDefinition[] = [
  {
    name: 'register',
    desc: 'Register account',
    args: [
      { name: 'name', type: 'str' },
      { name: 'pass', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli, server } = cmdInfo
      const { print, printError } = cli
      const { auth } = server

      const { success, message } = await auth.register(args[0], args[1])
      if (success) print('Account registered successfully.')
      else printError(message)
    }
  }
]

export default accountCommands