import { CommandDefinition } from '..'

const equipCommand: CommandDefinition = {
  name: 'equip',
  desc: 'Equip weapon or artifact',
  usage: [
    'equip <guid> <uid> - Equip weapon or artifact to player\'s current avatar',
    'equip <guid>       - (In game) Equip weapon or artifact to current avatar'
  ],
  args: [
    { name: 'guid', type: 'str' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError('Player not found.')

    const { currentAvatar } = player
    if (!currentAvatar) return printError('Current avatar is null.')

    const equip = player.getEquip(BigInt(args[0] || 0))
    if (!equip) return printError('Equip not found.')

    await currentAvatar.equip(equip)
    print(`Equipped ${args[0]} to current avatar.`)
  }
}

export default equipCommand