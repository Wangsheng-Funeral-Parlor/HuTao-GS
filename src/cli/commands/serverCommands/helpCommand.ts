import { ArgumentDefinition, CLILike, CommandDefinition } from ".."

import CLI from "@/cli"
import translate from "@/translate"
import { cRGB } from "@/tty/utils"

export function getArgumentInfo(argument: ArgumentDefinition) {
  const { name, optional, dynamic, type } = argument

  const bracket = optional ? "[]" : "<>"
  const spread = dynamic ? "..." : ""
  const argType = type == null ? "" : `:${type}`

  return `${bracket[0]}${spread}${name}${argType}${bracket[1]}`
}

export function getCommandInfo(command: CommandDefinition, prefix = "", showDesc = false) {
  const { name, args } = command
  const cmdName = cRGB(0xffffff, prefix + name)
  const cmdArgs = cRGB(0xffb71c, args != null && args.length > 0 ? " " + args.map(getArgumentInfo).join(" ") : "")
  const cmdDesc = showDesc ? " - " + translate(`cli.commands.${name}.desc`) : ""
  return `${cmdName}${cmdArgs}${cmdDesc}`
}

export function getCommandInfoAlias(command: CommandDefinition, prefix = "", showDesc = false) {
  const { name, args, alias } = command
  const data: string[] = []
  for (const alia of alias) {
    const cmdName = cRGB(0xffffff, prefix + alia)
    const cmdArgs = cRGB(0xffb71c, args != null && args.length > 0 ? " " + args.map(getArgumentInfo).join(" ") : "")
    const cmdDesc = showDesc ? " - " + translate(`cli.commands.${name}.desc`) : ""

    data.push(`${cmdName}${cmdArgs}${cmdDesc}`)
  }

  return data
}

function consoleHelpPage(cli: CLILike) {
  const { print } = cli

  print(translate("cli.commands.help.page.console.title"))
  for (let i = 0; i < 4; i++) print(" " + translate(`cli.commands.help.page.console.controls.${i}`))
}

function commandListHelpPage(cli: CLILike) {
  const { print } = cli

  print(translate("cli.commands.help.page.commandList.title"))

  const lines = CLI.commands.flatMap((cmd) =>
    [getCommandInfo(cmd, undefined, true)].concat(cmd.alias ? getCommandInfoAlias(cmd, undefined, true) : [])
  )
  for (const line of lines) print(` ${line}`)
}

function commandHelpPage(cli: CLILike, commandName?: string) {
  const { print, printError } = cli

  if (commandName == null) return commandListHelpPage(cli)

  const command = CLI.commands.find((c) => c.name === commandName || c.alias?.includes(commandName))
  if (command == null) return printError("Command not found:", commandName)

  print(translate("cli.commands.help.page.commandInfo.title"))
  print(" " + translate("cli.commands.help.page.commandInfo.syntax", getCommandInfo(command)))
  print(" " + translate("cli.commands.help.page.commandInfo.desc", translate(`cli.commands.${command.name}.desc`)))

  if (command.usage == null) return

  print(" " + translate("cli.commands.help.page.commandInfo.usage"))

  if (Array.isArray(command.usage)) {
    for (const usage of command.usage) print(`  ${usage}`)
  } else {
    for (let i = 0; i < command.usage; i++) print("  " + translate(`cli.commands.${command.name}.usage.${i}`))
  }
}

const helpCommand: CommandDefinition = {
  name: "help",
  usage: 3,
  args: [
    { name: "category", type: "str", values: ["command", "console"], optional: true },
    {
      name: "command",
      type: "str",
      get values() {
        return CLI.commands.flatMap((c) => (c.alias ? [c.name].concat(c.alias) : [c.name]))
      },
      optional: true,
    },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli } = cmdInfo
    const { print } = cli

    if (sender) return print(translate("cli.commands.help.error.inGame"))

    const [category, command] = args
    switch (category) {
      case "command":
        commandHelpPage(cli, command)
        break
      case "console":
        consoleHelpPage(cli)
        break
      default:
        if (category != null) print(translate("cli.commands.help.error.invalidCategory", category))
        commandHelpPage(cli, "help")
    }
  },
}

export default helpCommand
