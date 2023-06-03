import { CommandDefinition } from ".."

import SceneData from "$/gameData/data/SceneData"
import Vector from "$/utils/vector"
import translate from "@/translate"
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from "@/types/proto/enum"

const sceneCommand: CommandDefinition = {
  name: "scene",
  usage: 2,
  args: [
    { name: "id", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentWorld, currentScene, context } = player
    if (!currentWorld) return printError(translate("generic.notInWorld"))

    const scene = await currentWorld.getScene(id)
    const sceneData = await SceneData.getScene(id)
    if (!scene || !sceneData) return printError(translate("cli.commands.scene.error.sceneNotFound"))
    if (currentScene === scene) return printError(translate("cli.commands.scene.error.sameScene"))

    print(translate("cli.commands.scene.info.changeScene", scene.id))

    const { BornPos, BornRot } = sceneData

    const pos = new Vector()
    const rot = new Vector()

    pos.setData(BornPos)
    rot.setData(BornRot)

    scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
  },
}

export default sceneCommand
