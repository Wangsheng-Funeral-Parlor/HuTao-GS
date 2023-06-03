import { CommandDefinition } from ".."

import translate from "@/translate"

const lightningCommand: CommandDefinition = {
  name: "lightning",
  args: [{ name: "uid", type: "int" }],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    player.thunderTarget = !player.thunderTarget
    if (player.thunderTarget) print(translate("cli.commands.lightning.info.start"))
    else print(translate("cli.commands.lightning.info.stop"))
  },
}

export default lightningCommand
