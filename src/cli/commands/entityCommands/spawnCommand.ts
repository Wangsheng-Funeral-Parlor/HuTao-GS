import { CommandDefinition } from ".."

import Monster from "$/entity/monster"
import translate from "@/translate"

const spawnCommand: CommandDefinition = {
  name: "spawn",
  usage: 2,
  args: [
    { name: "id", type: "int" },
    { name: "lv", type: "int" },
    { name: "amount", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, vl, amount, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentScene, pos } = player
    if (!currentScene || !pos) return printError(translate("generic.playerNoPos"))

    print(translate("cli.commands.spawn.info.spawn", id))

    for (let i = 0; i < amount; i++) {
      let entity = new Monster(id, player)

      entity.motion.pos.copy(pos)
      entity.bornPos.copy(pos)

      await entity.initNew(vl)
      await currentScene.entityManager.add(entity)
    }
  },
}

export default spawnCommand
