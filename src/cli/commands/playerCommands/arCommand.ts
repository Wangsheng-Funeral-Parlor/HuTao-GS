import { CommandDefinition } from ".."

import translate from "@/translate"

const arCommand: CommandDefinition = {
  name: "ar",
  usage: 2,
  args: [
    { name: "level", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [level, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    await player.setLevel(level)
    print(translate("cli.commands.ar.info.setAR", player.level))
  },
}

export default arCommand
