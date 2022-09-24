import Weapon from '$/equip/weapon'
import { CommandDefinition } from '..'

const weaponCommand: CommandDefinition = {
  name: 'weapon',
  desc: 'Give weapon',
  usage: [
    'weapon <id> <count> <uid> - Give weapons to player',
    'weapon <id> <count>       - (In game) Give weapons to yourself',
    'weapon <id>               - (In game) Give 1 weapon to yourself'
  ],
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

    if (!player) return printError('Player not found.')

    const id = args[0]
    const count = args[1] || 1

    print('Give weapon:', `(${id})x${count}`)

    for (let i = 0; i < count; i++) {
      const weapon = new Weapon(id, player)
      await weapon.initNew()
      if (!await player.inventory.add(weapon)) return printError('Inventory full')
    }
  }
}

export default weaponCommand