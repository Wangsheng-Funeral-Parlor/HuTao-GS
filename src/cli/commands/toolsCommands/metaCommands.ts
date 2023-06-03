import { CommandDefinition } from ".."

import { decryptMetadata, dumpStringLiterals, encryptMetadata, patchMetadata } from "@/tools/metadata"
import translate from "@/translate"

const metaCommand: CommandDefinition = {
  name: "meta",
  usage: 4,
  args: [
    { name: "mode", type: "str", values: ["patch", "dump", "dec", "enc"] },
    { name: "input", type: "str" },
    { name: "output", type: "str" },
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli

    const [mode, input, output] = args
    try {
      switch (mode) {
        case "dec":
          await decryptMetadata(input, output)
          break
        case "enc":
          await encryptMetadata(input, output)
          break
        case "patch":
          await patchMetadata(input, output)
          break
        case "dump":
          await dumpStringLiterals(input, output)
          break
      }
      print(translate("cli.commands.meta.info.success"))
    } catch (err) {
      printError((<Error>err).message || err)
    }
  },
}

export default metaCommand
