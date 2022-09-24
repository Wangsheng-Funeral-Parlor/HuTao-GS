import { CommandDefinition } from '..'

const setcsCommand: CommandDefinition = {
  name: 'setcs',
  desc: 'Set cand skill for current avatar',
  usage: [
    'setcs <id> <uid> - Set cand skill for player\'s current avatar',
    'setcs <id>       - (In game) Set cand skill for current avatar'
  ],
  args: [
    { name: 'id', type: 'num' },
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

    if (await currentAvatar.skillManager.setCandSkillId(args[0])) {
      print(`Set cand skill to ${args[0]}.`)
    } else {
      printError('Skill not found.')
    }
  }
}

export default setcsCommand