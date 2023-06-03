import { CommandDefinition } from ".."

import Reliquary from "$/equip/reliquary"
import ReliquaryData from "$/gameData/data/ReliquaryData"
import translate from "@/translate"

const artSetCommand: CommandDefinition = {
  name: "artSet",
  alias: ["artset"],
  usage: 3,
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

    const artIdList = (await ReliquaryData.getSet(id))?.ContainsList
    if (artIdList == null) return printError(translate("cli.commands.artSet.error.setNotFound"))

    print(translate("cli.commands.artSet.info.give", id, 1))

    for (const id of artIdList) {
      const reliquary = new Reliquary(id, player)
      await reliquary.initNew()
      if (!(await player.inventory.add(reliquary))) return printError(translate("generic.inventoryFull"))
    }
  },
}

export default artSetCommand
