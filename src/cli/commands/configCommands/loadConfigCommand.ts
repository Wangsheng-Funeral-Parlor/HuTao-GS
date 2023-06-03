import { CommandDefinition } from ".."

import CLI from "@/cli"
import { AVAILABLE_CONFIGS } from "@/config"
import Server from "@/server"
import translate from "@/translate"
import { getJson, setJson } from "@/utils/json"

const loadConfigCommand: CommandDefinition = {
  name: "loadConfig",
  usage: 2,
  args: [
    {
      name: "name",
      type: "str",
      optional: true,
      get values() {
        return AVAILABLE_CONFIGS
      },
    },
  ],
  exec: async (cmdInfo) => {
    const { args, cli, server } = <{ args: string[]; cli: CLI; server: Server }>cmdInfo
    const { print, printError } = cli
    const [name] = args

    const configName = name || "default"
    const allConfigs = getJson("config.json", {})

    if (configName === "current") return printError(translate("cli.commands.loadConfig.error.invalidName", configName))
    if (allConfigs[configName] == null)
      return printError(translate("cli.commands.loadConfig.error.notFound", configName))

    print(translate("cli.commands.loadConfig.info.load", configName))

    allConfigs.current = configName
    if (allConfigs.current === "default") delete allConfigs.current

    setJson("config.json", allConfigs)

    cli.stop()
    await server.restart()
  },
}

export default loadConfigCommand
