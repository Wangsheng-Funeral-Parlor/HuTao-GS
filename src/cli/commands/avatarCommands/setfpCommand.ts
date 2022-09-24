import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const setfpCommand: CommandDefinition = {
  name: 'setfp',
  desc: 'Set fight prop for current avatar',
  usage: [
    'setfp <prop> <value> <uid> - Set fight prop for player\'s current avatar',
    'setfp <prop> <value>       - (In game) Set fight prop for current avatar'
  ],
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

    if (!player) return printError('Player not found.')

    const prop = isNaN(parseInt(args[0])) ? FightPropEnum[<string>args[0]] : args[0]
    if (FightPropEnum[prop] == null) return printError('Invalid fight prop.')

    const { currentAvatar } = player
    if (!currentAvatar) return printError('Current avatar is null.')

    await currentAvatar.setProp(prop, args[1], true)
    print(`Set ${FightPropEnum[prop]}(${prop}) to ${args[1]}.`)
  }
}

export default setfpCommand