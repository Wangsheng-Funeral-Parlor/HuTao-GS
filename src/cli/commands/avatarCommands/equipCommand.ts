import translate from '@/translate'
import { CommandDefinition } from '..'

const equipCommand: CommandDefinition = {
  name: 'equip',
  usage: 2,
  args: [
    { name: 'guid', type: 'str' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    const equip = player.getEquip(BigInt(args[0] || 0))
    if (!equip) return printError(translate('cli.commands.equip.error.noEquip'))

    await currentAvatar.equip(equip)
    print(translate('cli.commands.equip.info.equip', args[0]))
  }
}

export default equipCommand