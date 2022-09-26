import Weapon from '$/equip/weapon'
import translate from '@/translate'
import { CommandDefinition } from '..'

const weaponCommand: CommandDefinition = {
  name: 'weapon',
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

    print(translate('cli.commands.weapon.info.give', id, count))

    for (let i = 0; i < count; i++) {
      const weapon = new Weapon(id, player)
      await weapon.initNew()
      if (!await player.inventory.add(weapon)) return printError(translate('generic.inventoryFull'))
    }
  }
}

export default weaponCommand