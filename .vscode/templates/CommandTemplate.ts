import { CommandDefinition } from '..'

const {{name}}Command: CommandDefinition = {
  name: '{{name}}',
  //usage: 1,
  //args: [],
  //allowPlayer: false,
  //onlyAllowPlayer: false,
  exec: async (cmdInfo) => {
    const { args, sender, cli, tty, server, kcpServer } = cmdInfo
    const { print, printError } = cli

    print('{{name}}', args, sender, cli, tty, server, kcpServer)
    printError('{{name}}')
  }
}

export default {{name}}Command