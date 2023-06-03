import { CommandDefinition } from ".."

import translate from "@/translate"
import { getJson, setJson } from "@/utils/json"

const deleteConfigCommand: CommandDefinition = {
  name: "deleteConfig",
  usage: 2,
  args: [{ name: "name", type: "str", optional: true }],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli
    const [name] = args

    const configName = name || "default"
    const allConfigs = getJson("config.json", {})

    if (configName === "current")
      return printError(translate("cli.commands.deleteConfig.error.invalidName", configName))
    if (allConfigs[configName] == null)
      return printError(translate("cli.commands.deleteConfig.error.notFound", configName))

    print(translate("cli.commands.deleteConfig.info.delete", configName))

    delete allConfigs[configName]
    setJson("config.json", allConfigs)

    print(translate("cli.commands.deleteConfig.info.deleted"))
  },
}

export default deleteConfigCommand
