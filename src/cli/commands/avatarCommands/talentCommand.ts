import { CommandDefinition } from ".."

import translate from "@/translate"

const talentCommand: CommandDefinition = {
  name: "talent",
  alias: ["const"],
  usage: 6,
  args: [
    { name: "mode", type: "str", values: ["unlock", "lock", "list"] },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [mode, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate("generic.playerNoCurAvatar"))

    const { talentManager } = currentAvatar

    switch (mode) {
      case "unlock": {
        const talent = await talentManager.unlockTalent()
        if (talent) print(translate("cli.commands.const.info.unlocked", talent.id))
        else printError(translate("cli.commands.const.error.constNotFound"))
        break
      }
      case "lock": {
        const talent = await talentManager.lockTalent()
        if (talent) print(translate("cli.commands.const.info.locked", talent.id))
        else printError(translate("cli.commands.const.error.constNotFound"))
        break
      }
      case "list": {
        print(`[${talentManager.unlockedTalents.map((t) => t.id).join(", ")}]`)
        break
      }
    }
  },
}

export default talentCommand
