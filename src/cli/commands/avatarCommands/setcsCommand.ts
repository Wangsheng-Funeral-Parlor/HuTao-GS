import translate from '@/translate'
import { CommandDefinition } from '..'

const setcsCommand: CommandDefinition = {
  name: 'setcs',
  usage: 2,
  args: [
    { name: 'id', type: 'num' },
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

    if (await currentAvatar.skillManager.setCandSkillId(args[0])) {
      print(translate('cli.commands.setcs.info.setSkill', args[0]))
    } else {
      printError(translate('cli.commands.setcs.error.noSkill'))
    }
  }
}

export default setcsCommand