import Material from '$/material'
import { CommandDefinition } from '..'

const materialCommand: CommandDefinition = {
  name: 'material',
  desc: 'Give material',
  usage: [
    'material <id> <count> <uid> - Give materials to player',
    'material <id> <count>       - (In game) Give materials to yourself',
    'material <id>               - (In game) Give 1 material to yourself'
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

    const material = await Material.create(player, id, count)
    print('Give material:', `(${id})x${material.count}`)

    if (!await player.inventory.add(material)) printError('Inventory full')
  }
}

export default materialCommand