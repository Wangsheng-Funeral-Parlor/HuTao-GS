import translate from '@/translate'
import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const setfpCommand: CommandDefinition = {
  name: 'setfp',
  usage: 2,
  args: [
    { name: 'prop', type: 'str' },
    { name: 'value', type: 'num' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const prop = isNaN(parseInt(args[0])) ? FightPropEnum[<string>args[0]] : args[0]
    if (FightPropEnum[prop] == null) return printError(translate('cli.commands.setfp.error.invalidFightProp'))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    await currentAvatar.setProp(prop, args[1], true)
    print(translate('cli.commands.setfp.info.set', FightPropEnum[prop], prop, args[1]))
  }
}

export default setfpCommand