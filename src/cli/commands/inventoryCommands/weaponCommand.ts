import { CommandDefinition } from ".."

import Weapon from "$/equip/weapon"
import translate from "@/translate"

const weaponCommand: CommandDefinition = {
  name: "weapon",
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

    print(translate("cli.commands.weapon.info.give", id, count || 1))

    for (let i = 0; i < count || 1; i++) {
      const weapon = new Weapon(id, player)
      await weapon.initNew()
      if (!(await player.inventory.add(weapon))) return printError(translate("generic.inventoryFull"))
    }
  },
}

export default weaponCommand
