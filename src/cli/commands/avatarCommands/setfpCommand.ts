import { CommandDefinition } from ".."

import translate from "@/translate"
import { FightPropEnum } from "@/types/enum"

const setfpCommand: CommandDefinition = {
  name: "setfp",
  usage: 2,
  args: [
    { name: "propid", type: "str" },
    { name: "value", type: "num" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [propid, value, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const prop = isNaN(parseInt(propid)) ? FightPropEnum[<string>propid] : propid
    if (FightPropEnum[prop] == null) return printError(translate("cli.commands.setfp.error.invalidFightProp"))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate("generic.playerNoCurAvatar"))

    await currentAvatar.setProp(prop, value, true)
    print(translate("cli.commands.setfp.info.set", FightPropEnum[prop], prop, value))
  },
}

export default setfpCommand
