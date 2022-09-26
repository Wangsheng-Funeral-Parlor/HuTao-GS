import Material from '$/material'
import translate from '@/translate'
import { CommandDefinition } from '..'

const materialCommand: CommandDefinition = {
  name: 'material',
  usage: 3,
  args: [
    { name: 'id', type: 'int' },
    { name: 'count', type: 'int', optional: true },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const id = args[0]
    const count = args[1] || 1

    const material = await Material.create(player, id, count)
    print(translate('cli.commands.material.info.give', id, material.count))

    if (!await player.inventory.add(material)) printError(translate('generic.inventoryFull'))
  }
}

export default materialCommand