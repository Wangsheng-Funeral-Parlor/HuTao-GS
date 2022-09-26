import translate from '@/translate'
import { EquipTypeEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const guidCommand: CommandDefinition = {
  name: 'guid',
  usage: 2,
  args: [
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    const { guid, equipMap } = currentAvatar
    const equips = Object.entries(equipMap).map(e => `${EquipTypeEnum[parseInt(e[0])]}: ${e[1]?.guid?.toString()}`)

    print(`Avatar: ${guid?.toString()}`)
    for (const equip of equips) print(equip)
  }
}

export default guidCommand