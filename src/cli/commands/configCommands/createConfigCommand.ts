import { CommandDefinition } from ".."

import { DEFAULT_CONFIG } from "@/config"
import translate from "@/translate"
import { getJson, setJson } from "@/utils/json"

const createConfigCommand: CommandDefinition = {
  name: "createConfig",
  usage: 2,
  args: [{ name: "name", type: "str", optional: true }],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli
    const [name] = args

    const configName = name || "default"
    const allConfigs = getJson("config.json", {})

    if (configName === "current")
      return printError(translate("cli.commands.createConfig.error.invalidName", configName))
    if (allConfigs[configName] != null)
      return printError(translate("cli.commands.createConfig.error.exists", configName))

    print(translate("cli.commands.createConfig.info.create", configName))

    allConfigs[configName] = DEFAULT_CONFIG
    setJson("config.json", allConfigs)

    print(translate("cli.commands.createConfig.info.created"))
  },
}

export default createConfigCommand
