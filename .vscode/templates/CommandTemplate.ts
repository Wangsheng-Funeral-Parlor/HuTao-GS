import { CommandDefinition } from '..'

const templateCommand: CommandDefinition = {
  name: 'template',
  //usage: 1,
  //args: [],
  //allowPlayer: false,
  //onlyAllowPlayer: false,
  exec: async (cmdInfo) => {
    const { args, sender, cli, tty, server, kcpServer } = cmdInfo
    const { print, printError } = cli

    print('Template', args, sender, cli, tty, server, kcpServer)
    printError('Template')
  }
}

export default templateCommand