import { CommandDefinition } from '..'

const templateCommand: CommandDefinition = {
  name: 'template',
  desc: 'template',
  //usage: [],
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