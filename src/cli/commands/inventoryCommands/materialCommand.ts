import { CommandDefinition } from ".."

import Material from "$/material"
import translate from "@/translate"

const materialCommand: CommandDefinition = {
  name: "material",
  usage: 3,
  args: [
    { name: "id", type: "int" },
    { name: "count", type: "int", optional: true },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, count, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const material = await Material.create(player, id, count || 1)
    print(translate("cli.commands.material.info.give", id, material.count))

    if (!(await player.inventory.add(material))) printError(translate("generic.inventoryFull"))
  },
}

export default materialCommand
