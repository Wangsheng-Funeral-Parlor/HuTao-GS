import { CommandDefinition } from ".."

import translate from "@/translate"

const mcoinCommand: CommandDefinition = {
  name: "mcoin",
  usage: 2,
  args: [
    { name: "amount", type: "int" },
    { name: "uid", type: "int", optional: true },
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [amount, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    print(translate("cli.commands.mcoin.info.give", amount))

    player.addGenesisCrystal(amount)
  },
}

export default mcoinCommand
