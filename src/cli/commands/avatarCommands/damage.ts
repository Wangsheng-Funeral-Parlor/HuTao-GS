import { CommandDefinition } from ".."

import translate from "@/translate"

const damageCommand: CommandDefinition = {
  name: "damage",
  alias: ["dmg"],
  //usage: 1,
  args: [
    { name: "damage", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, tty, server, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [damage, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate("generic.playerNoCurAvatar"))

    currentAvatar.takeDamage(0, damage, true)
  },
}

export default damageCommand
