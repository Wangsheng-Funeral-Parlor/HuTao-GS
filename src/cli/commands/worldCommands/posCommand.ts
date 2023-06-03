import { CommandDefinition } from ".."

import translate from "@/translate"

const posCommand: CommandDefinition = {
  name: "pos",
  usage: 2,
  args: [{ name: "uid", type: "int", optional: true }],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const pos = player.pos
    if (!pos) return printError(translate("generic.playerNoPos"))

    print(translate("cli.commands.pos.info.posInfo", player.currentScene?.id || "?", pos.x, pos.y, pos.z))
  },
}

export default posCommand
