import { CommandDefinition } from ".."

import translate from "@/translate"

const rechargeCommand: CommandDefinition = {
  name: "recharge",
  usage: 2,
  args: [{ name: "uid", type: "int", optional: true }],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const avatarList = player.teamManager.getTeam()?.avatarList || []
    for (const avatar of avatarList) await avatar.rechargeEnergy(true)

    print(translate("cli.commands.recharge.info.recharge"))
  },
}

export default rechargeCommand
