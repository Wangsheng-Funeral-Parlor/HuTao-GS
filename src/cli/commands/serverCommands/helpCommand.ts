import CLI from '@/cli'
import { cRGB } from '@/tty/utils'
import { ArgumentDefinition, CLILike, CommandDefinition } from '..'

export function getArgumentInfo(argument: ArgumentDefinition) {
  const { name, optional, dynamic, type } = argument

  const bracket = optional ? '[]' : '<>'
  const spread = dynamic ? '...' : ''
  const argType = type == null ? '' : `:${type}`

  return `${bracket[0]}${spread}${name}${argType}${bracket[1]}`
}

export function getCommandInfo(command: CommandDefinition, prefix: string = '', showDesc: boolean = false) {
  const { name, args, desc } = command
  return `${cRGB(0xffffff, prefix + name)}${cRGB(0xffb71c, (args != null && args.length > 0) ? (' ' + args.map(getArgumentInfo).join(' ')) : '')}${showDesc ? (' - ' + desc) : ''}`
}

function consoleHelpPage(cli: CLILike) {
  const { print } = cli

  print('Console controls:')
  print(' Page up/Page down   - Scroll up/down')
  print(' Up arrow/Down arrow - Previous/Next command')
  print(' Tab/Right arrow     - Auto complete')
  print(' Escape              - Cancel input')
}

function commandListHelpPage(cli: CLILike) {
  const { print } = cli

  print('Command list')

  const lines = CLI.commands.map(cmd => getCommandInfo(cmd, undefined, true))
  for (const line of lines) print(` ${line}`)
}

function commandHelpPage(cli: CLILike, commandName?: string) {
  const { print, printError } = cli

  if (commandName == null) return commandListHelpPage(cli)

  const command = CLI.commands.find(c => c.name === commandName)
  if (command == null) return printError('Command not found:', commandName)

  print('Command info')
  print(' Command:', commandName)
  print(' Syntax:', getCommandInfo(command))
  print(' Description:', command.desc)

  if (command.usage == null) return

  print(' Usage:')
  for (const line of command.usage) print(`  ${line}`)
}

const helpCommand: CommandDefinition = {
  name: 'help',
  desc: 'Show help messages',
  usage: [
    'help command           - Command list',
    'help command <command> - Command info',
    'help console           - Console controls'
  ],
  args: [
    { name: 'category', type: 'str', values: ['command', 'console'], optional: true },
    { name: 'command', type: 'str', get values() { return CLI.commands.map(c => c.name) }, optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli } = cmdInfo
    const { print } = cli

    if (sender) return print('Please visit announcement for list of commands.')

    const [category, command] = args
    switch (category) {
      case 'command':
        commandHelpPage(cli, command)
        break
      case 'console':
        consoleHelpPage(cli)
        break
      default:
        if (category != null) print('Unknown category:', category)
        commandHelpPage(cli, 'help')
    }
  }
}

export default helpCommand