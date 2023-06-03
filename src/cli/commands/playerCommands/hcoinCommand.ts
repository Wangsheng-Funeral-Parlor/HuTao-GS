import { CommandDefinition } from ".."

import translate from "@/translate"

const hcoinCommand: CommandDefinition = {
  name: "hcoin",
  alias: ["primogen"],
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

    print(translate("cli.commands.hcoin.info.give", amount))

    player.addPrimogem(amount)
  },
}

export default hcoinCommand
