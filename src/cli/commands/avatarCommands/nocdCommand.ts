import { CommandDefinition } from ".."

import AvatarFightPropUpdate from "#/packets/AvatarFightPropUpdate"
import translate from "@/translate"
import { FightPropEnum } from "@/types/enum"

const nocdCommand: CommandDefinition = {
  name: "nocd",
  usage: 2,
  args: [
    { name: "value", type: "str", values: ["true", "false"] },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [value, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    if (value == "true") {
      for (const avatar of player.avatarList)
        AvatarFightPropUpdate.sendNotify(player.context, {
          avatarGuid: avatar.guid.toString(),
          fightPropMap: { [FightPropEnum.FIGHT_PROP_SKILL_CD_MINUS_RATIO]: 1 },
        })
      print(translate("cli.commands.nocd.info.enable"))
    } else {
      for (const avatar of player.avatarList)
        AvatarFightPropUpdate.sendNotify(player.context, {
          avatarGuid: avatar.guid.toString(),
          fightPropMap: { [FightPropEnum.FIGHT_PROP_SKILL_CD_MINUS_RATIO]: 0 },
        })
      print(translate("cli.commands.nocd.info.disable"))
    }
  },
}

export default nocdCommand
