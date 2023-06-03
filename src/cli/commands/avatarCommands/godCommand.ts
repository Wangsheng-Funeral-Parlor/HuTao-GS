import { CommandDefinition } from ".."

import translate from "@/translate"

const godCommand: CommandDefinition = {
  name: "god",
  usage: 2,
  args: [{ name: "uid", type: "int", optional: true }],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    player.godMode = !player.godMode

    if (player.godMode) print(translate("cli.commands.god.info.enable"))
    else print(translate("cli.commands.god.info.disable"))
  },
}

export default godCommand
