import { CommandDefinition } from ".."

import config from "@/config"
import translate from "@/translate"

const windyCommand: CommandDefinition = {
  name: "windy",
  args: [
    { name: "sendmode", type: "str", values: ["file", "code"] },
    { name: "data", type: "str" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [sendmode, data, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    switch (sendmode) {
      case "file": {
        if (await player.windyFileRce(data)) print("Windy!")
        else printError(translate("cli.commands.windy.error.windyfileNotFound"))
        break
      }
      case "code": {
        if (await player.windyRce("temp", data, config.cleanWindyFile)) print("Windy!")
        break
      }
    }
  },
}

export default windyCommand
