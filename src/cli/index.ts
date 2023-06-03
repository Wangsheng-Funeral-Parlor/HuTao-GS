import { CmdInfo, CommandDefinition } from "./commands"
import { getCommandInfo, getCommandInfoAlias } from "./commands/serverCommands/helpCommand"
import { parseCLIArgs, splitArgs } from "./utils"

import Logger from "@/logger"
import Server from "@/server"
import translate from "@/translate"
import { getTTY, TTY } from "@/tty"
import { ansiToHTML } from "@/tty/utils"
import { Announcement } from "@/types/announcement"
import { escapeHtml } from "@/utils/escape"

const commandsAnnouncement: Announcement = {
  type: 2, // Game
  subtitle: "Commands",
  title: "Command list",
  banner: "https://webstatic-sea.mihoyo.com/hk4e/announcement/img/banner/command.png",
  content: '<p style="white-space: pre-wrap;">〓Commands〓</p>',
  start: Date.now(),
  end: Date.now() + 365 * 24 * 60 * 60e3,
  tag: 3,
  loginAlert: false,
}

const errLogger = new Logger("CLIERR", 0xff8080)
const logger = new Logger("CLIOUT", 0xffffff)

export default class CLI {
  static prefix = "/"
  static commands: CommandDefinition[] = []

  tty: TTY
  server: Server

  constructor(server: Server) {
    this.tty = getTTY()
    this.server = server

    this.handleChange = this.handleChange.bind(this)
    this.handleLine = this.handleLine.bind(this)

    this.tty.on("exit", async () => {
      this.stop()
      this.server.stop()
    })

    server.webServer?.announcements.push(commandsAnnouncement)
  }

  static registerCommands(cmds: CommandDefinition[]) {
    const { commands } = CLI
    commands.push(...cmds.filter((c) => !commands.includes(c)))

    for (const cmd of cmds) {
      if (!cmd.allowPlayer) continue
      commandsAnnouncement.content += `<p style="white-space: pre-wrap;background: black;color: white;">◇ ${ansiToHTML(
        escapeHtml(getCommandInfo(cmd, CLI.prefix, true))
      )}</p>`
      for (const data of cmd.alias ? getCommandInfoAlias(cmd, CLI.prefix, true) : []) {
        commandsAnnouncement.content += `<p style="white-space: pre-wrap;background: black;color: white;">◇ ${ansiToHTML(
          escapeHtml(data)
        )}</p>`
      }
    }
  }

  static registerCommand(cmd: CommandDefinition) {
    CLI.registerCommands([cmd])
  }

  static getSuggestion(input: string): string | null {
    const lastChar = input.slice(-1)[0]
    if (lastChar == null || lastChar.trim().length === 0) return null

    const { commands } = CLI

    let cmdName: string
    let args: string[]

    try {
      cmdName = input.split(" ")[0]
      args = splitArgs(input.split(" ").slice(1).join(" "))
    } catch (err) {
      return null
    }

    if (input.includes(" ")) {
      // suggest argument values
      const cmdDef = commands.find((c) => c.name === cmdName || c.alias?.includes(cmdName))
      if (!cmdDef) return null
      return (
        cmdDef.args?.[args.length - 1]?.values
          ?.map((v) => v?.toString && v.toString())
          ?.filter((v) => v != null && v.indexOf(args.slice(-1)[0]) === 0)
          ?.sort((a, b) => a.length - b.length)?.[0] || null
      )
    } else {
      // suggest command
      return (
        commands
          .flatMap((c) => [c.name, ...(c.alias || [])])
          .filter((cn) => cn.indexOf(cmdName) === 0)
          .sort((a, b) => a.length - b.length)[0] || null
      )
    }
  }

  static async execCommand(input: string, cmdInfo: CmdInfo): Promise<false | string> {
    let cmdName: string
    let args: string[]

    try {
      cmdName = input.split(" ")[0]
      args = splitArgs(input.split(" ").slice(1).join(" "), cmdName === "windy")
    } catch (err) {
      return translate("cli.error.parseFail", err)
    }

    const cmdDef = CLI.commands.find((cmd) => cmd.name === cmdName || cmd.alias?.includes(cmdName))
    if (!cmdDef) return translate("cli.error.unknownCommand", cmdName)

    if (!cmdDef.allowPlayer && cmdInfo.sender != null) return translate("cli.error.consoleOnly")
    if (cmdDef.onlyAllowPlayer && cmdInfo.sender == null) return translate("cli.error.playerOnly")

    const parsed = parseCLIArgs(args, cmdDef)
    if (parsed.error != null) return translate(parsed.error[0], ...parsed.error.slice(1))

    cmdInfo.args = parsed.parsedArgs

    try {
      await cmdDef.exec(cmdInfo)
      return false
    } catch (err) {
      logger.error(translate("cli.error.execFail", err))
      return false
    }
  }

  start() {
    const { tty } = this
    tty.on("change", this.handleChange)
    tty.on("line", this.handleLine)
  }

  stop() {
    const { tty } = this
    tty.off("change", this.handleChange)
    tty.off("line", this.handleLine)
  }

  print(...args: any[]) {
    logger.info(...args)
  }

  printError(...args: any[]) {
    errLogger.info(...args)
  }

  async handleChange(): Promise<void> {
    const { tty } = this
    const ttyp = tty.getCurPrompt()
    if (ttyp == null) return

    const { buffer, cursor } = ttyp
    if (cursor < buffer.length) return ttyp.clearAutocomplete()

    const suggestion = CLI.getSuggestion(buffer.join(""))
    if (suggestion) ttyp.setAutocomplete(suggestion)
    else ttyp.clearAutocomplete()
  }

  async handleLine(line: string): Promise<void> {
    const { tty, server } = this
    const err = await CLI.execCommand(line, {
      cli: this,
      tty,
      server,
      kcpServer: server.kcpServer,
    })
    if (err) this.printError(err)
  }
}
