import translate from '@/translate'
import { CommandDefinition } from '..'

const talentCommand: CommandDefinition = {
  name: 'talent',
  usage: 6,
  args: [
    { name: 'mode', type: 'str', values: ['unlock', 'lock', 'list'] },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [mode, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    const { talentManager } = currentAvatar

    switch (mode) {
      case 'unlock': {
        const talent = await talentManager.unlockTalent()
        if (talent) print(translate('cli.commands.talent.info.unlocked', talent.id))
        else printError(translate('cli.commands.talent.error.talentNotFound'))
        break
      }
      case 'lock': {
        const talent = await talentManager.lockTalent()
        if (talent) print(translate('cli.commands.talent.info.locked', talent.id))
        else printError(translate('cli.commands.talent.error.talentNotFound'))
        break
      }
      case 'list': {
        print(`[${talentManager.unlockedTalents.map(t => t.id).join(', ')}]`)
        break
      }
    }
  }
}

export default talentCommand