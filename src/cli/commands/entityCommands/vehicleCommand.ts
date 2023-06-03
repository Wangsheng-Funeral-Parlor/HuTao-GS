import { CommandDefinition } from ".."

import Vector from "$/utils/vector"
import translate from "@/translate"

const vehicleCommand: CommandDefinition = {
  name: "vehicle",
  usage: 2,
  args: [{ name: "uid", type: "int", optional: true }],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentScene, pos } = player
    if (!currentScene || !pos) return printError(translate("generic.playerNoPos"))

    print(translate("cli.commands.vehicle.info.spawn"))

    await currentScene.vehicleManager.createVehicle(player, 45001001, 0, pos, new Vector())
  },
}

export default vehicleCommand
