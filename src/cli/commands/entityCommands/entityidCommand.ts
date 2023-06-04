import { CommandDefinition } from ".."

import translate from "@/translate"

const entityidCommand: CommandDefinition = {
  name: "entityid",
  args: [{ name: "uid", type: "int", optional: true }],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, tty, server, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    print(`uid: ${uid || sender?.uid} currentAvatar: ${player.currentAvatar.entityId}`)
  },
}

export default entityidCommand
