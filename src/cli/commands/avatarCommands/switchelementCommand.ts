import { CommandDefinition } from ".."

import translate from "@/translate"

const element = { elementless: 0, pyro: 1, hydro: 2, anemo: 3, cryo: 4, geo: 5, electro: 6, dendro: 7 }
const switchelementCommand: CommandDefinition = {
  name: "switchelement",
  alias: ["se"],
  usage: 1,
  args: [
    { name: "elementname", type: "str" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    let [elementname, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate("generic.playerNoCurAvatar"))

    switch (elementname.toLowerCase()) {
      case "elementless":
      case "white":
      case "common":
        elementname = "elementless"
        break
      case "fire":
      case "pyro":
        elementname = "pyro"
        break
      case "hydro":
      case "water":
        elementname = "hydro"
        break
      case "anemo":
      case "wind":
      case "air":
        elementname = "anemo"
        break
      case "cryo":
      case "ice":
        elementname = "cryo"
        break
      case "geo":
      case "rock":
        elementname = "geo"
        break
      case "electro":
      case "lightning":
        elementname = "electro"
        break
      case "dendro":
      case "grass":
      case "plant":
        elementname = "dendro"
        break
      default:
        return printError(translate("cli.commands.switchelement.error.notElementName"))
    }
    if (currentAvatar.avatarId === 10000007 || currentAvatar.avatarId === 10000005) {
      currentAvatar.skillManager.setCandSkillId(element[elementname])
      print(translate("cli.commands.switchelement.info.changeElement", elementname))
    } else {
      return printError(translate("cli.commands.switchelement.error.notTravelerAvatar"))
    }
  },
}

export default switchelementCommand
