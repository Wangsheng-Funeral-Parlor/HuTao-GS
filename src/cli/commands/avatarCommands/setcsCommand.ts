import { CommandDefinition } from ".."

import translate from "@/translate"

const setcsCommand: CommandDefinition = {
  name: "setcs",
  usage: 2,
  args: [
    { name: "id", type: "num" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate("generic.playerNoCurAvatar"))

    if (await currentAvatar.skillManager.setCandSkillId(id)) {
      print(translate("cli.commands.setcs.info.setSkill", id))
    } else {
      printError(translate("cli.commands.setcs.error.noSkill"))
    }
  },
}

export default setcsCommand
