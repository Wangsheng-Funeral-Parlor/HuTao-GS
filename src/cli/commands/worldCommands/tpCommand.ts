import { CommandDefinition } from ".."

import Vector from "$/utils/vector"
import translate from "@/translate"
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from "@/types/proto/enum"

const tpCommand: CommandDefinition = {
  name: "tp",
  usage: 2,
  args: [
    { name: "x", type: "int" },
    { name: "y", type: "int" },
    { name: "z", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [x, y, z, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentScene, context } = player
    if (!currentScene) return printError(translate("generic.notInScene"))

    print(translate("cli.commands.tp.info.tp", x, y, z))

    currentScene.join(
      context,
      new Vector(x, y, z),
      new Vector(),
      SceneEnterTypeEnum.ENTER_GOTO,
      SceneEnterReasonEnum.TRANS_POINT
    )
  },
}

export default tpCommand
